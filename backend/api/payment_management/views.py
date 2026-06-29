import contextlib
import json
import os

import environ
import requests
import stripe
from django.conf import settings
from django.db import transaction as db_transaction
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

# from payment.models import PaymentRequest
# from payment.serializers import PaymentRequestSerializer
from rest_framework import permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from api.pagination import (
    CustomPagination,
    CustomPaginationTransition,
)
from api.project.serializers import (
    BidSerializer,
    ProjectSerializer,
    TransectionSerializer,
)
from chat_management.models import Notification
from payment_handle.gateways.escrow import (
    PaymentGatewayAPI,
    normalize_orange_cameroon_msisdn,
)
from profile_management.models import BankDetails, Profile
from profile_management.subscriptions import refresh_profile_subscription_status
from project_management.models import Bid, Project, Transactions

stripe.api_key = settings.STRIPE_TEST_SECRET_KEY

env = environ.Env()
environ.Env.read_env(".env")

ESCROW_BASE_API = os.getenv('ESCROW_BASE_API')
BASE_FRONTEND_URL = os.getenv("BASE_FRONTEND_URL")

# Dev Cred


def _normalize_orange_msisdn(msisdn):
    return normalize_orange_cameroon_msisdn(msisdn)


def _build_orange_reference_filter(order_id=None, pay_token=None, orange_txn_id=None):
    filters = []
    if order_id:
        filters.append(Q(external_order_id=str(order_id)))
    if pay_token:
        filters.append(Q(payment_token=str(pay_token)))
    if orange_txn_id:
        filters.append(Q(gateway_transaction_id=str(orange_txn_id)))

    if not filters:
        return None

    reference_filter = filters[0]
    for item in filters[1:]:
        reference_filter |= item
    return reference_filter


def _orange_reference_conflict(transaction_obj, identifiers):
    checks = {
        "order_id": "external_order_id",
        "pay_token": "payment_token",
        "orange_txn_id": "gateway_transaction_id",
    }
    for identifier_key, transaction_field in checks.items():
        supplied_value = identifiers.get(identifier_key)
        existing_value = getattr(transaction_obj, transaction_field, None)
        if supplied_value and existing_value and str(existing_value) != str(supplied_value):
            return f"Orange {identifier_key} does not match the existing transaction."
    return None


def _extract_orange_identifiers(payload):
    payload = payload or {}
    data = payload.get("data") or {}
    return {
        "order_id": payload.get("order_id") or payload.get("orderId") or data.get("orderId"),
        "pay_token": payload.get("pay_token") or payload.get("payToken") or data.get("payToken"),
        "orange_txn_id": (
            payload.get("orange_txn_id")
            or payload.get("orangeTransactionId")
            or data.get("id")
            or data.get("txnid")
        ),
        "bid_id": payload.get("bid_id") or data.get("bid_id"),
        "project_id": payload.get("project_id") or data.get("project_id"),
    }


def _normalize_orange_status(status_value):
    normalized = str(status_value or "").strip().upper()
    if normalized in {"SUCCESSFULL", "SUCCESSFUL", "SUCCESS", "SUCCEEDED"}:
        return "SUCCESS"
    if normalized in {"FAILED", "FAIL", "CANCELLED", "CANCELED", "EXPIRED"}:
        return "FAILED"
    return normalized or "PENDING"


def _sync_orange_project_payment(payload, forced_status=None):
    identifiers = _extract_orange_identifiers(payload)
    response_status = (
        forced_status
        or payload.get("status")
        or payload.get("payment_status")
        or (payload.get("data") or {}).get("status")
    )
    orange_status = _normalize_orange_status(response_status)

    transaction_obj = None
    reference_filter = _build_orange_reference_filter(
        identifiers["order_id"],
        identifiers["pay_token"],
        identifiers["orange_txn_id"],
    )
    if reference_filter is None:
        return {"updated": False, "message": "Orange payment reference is required."}

    transaction_obj = (
        Transactions.objects.filter(reference_filter, transaction_type="collection", payment_type="orange")
        .order_by("-created_at")
        .first()
    )

    if not transaction_obj:
        return {"updated": False, "message": "No matching Orange transaction found for supplied reference."}

    reference_conflict = _orange_reference_conflict(transaction_obj, identifiers)
    if reference_conflict:
        return {"updated": False, "message": reference_conflict}

    bid = None
    if transaction_obj.bid:
        bid = transaction_obj.bid
    elif identifiers["bid_id"]:
        bid = Bid.objects.select_related("project").filter(id=identifiers["bid_id"]).first()

    if identifiers["bid_id"] and transaction_obj.bid_id and str(transaction_obj.bid_id) != str(identifiers["bid_id"]):
        return {"updated": False, "message": "Orange bid reference does not match the existing transaction."}

    if (
        identifiers["project_id"]
        and transaction_obj.project_id
        and str(transaction_obj.project_id) != str(identifiers["project_id"])
    ):
        return {"updated": False, "message": "Orange project reference does not match the existing transaction."}

    if not bid:
        return {"updated": False, "message": "No matching Orange bid transaction found."}

    with db_transaction.atomic():
        transaction_obj.external_order_id = identifiers["order_id"] or transaction_obj.external_order_id
        transaction_obj.payment_token = identifiers["pay_token"] or transaction_obj.payment_token
        transaction_obj.gateway_transaction_id = (
            str(identifiers["orange_txn_id"]) if identifiers["orange_txn_id"] else transaction_obj.gateway_transaction_id
        )
        transaction_obj.bid = bid
        transaction_obj.project = bid.project
        transaction_obj.payment_type = "orange"
        transaction_obj.transaction_type = "collection"

        if orange_status == "SUCCESS":
            transaction_obj.status = "completed"
            Bid.objects.filter(project=bid.project).exclude(id=bid.id).update(status="Rejected", is_accepted=False)
            bid.status = "Accepted"
            bid.is_accepted = True
            bid.project.status = "ongoing"
            bid.project.save(update_fields=["status", "updated_at"])
            bid.save(update_fields=["status", "is_accepted", "updated_at"])
        elif orange_status == "FAILED":
            transaction_obj.status = "failed"
        else:
            transaction_obj.status = "pending"

        transaction_obj.save(
            update_fields=[
                "external_order_id",
                "payment_token",
                "gateway_transaction_id",
                "bid",
                "project",
                "payment_type",
                "transaction_type",
                "status",
                "updated_at",
            ]
        )

    return {
        "updated": True,
        "status": transaction_obj.status,
        "transaction_id": transaction_obj.id,
        "bid_id": bid.id,
        "project_id": bid.project.id,
    }


class PaymentApiView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self,request):
        profile = Profile.objects.get(user__id=request.user.id)
        is_payment_verified = refresh_profile_subscription_status(profile)
        return Response(
            {
                "error": "Use the verified subscription payment flow to activate membership.",
                "is_payment_verified": is_payment_verified,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    def get(self, request, format=None):
        try:
            search_query = request.query_params.get('search', '')
            if search_query:
                transactions= Transactions.objects.filter(status__icontains=search_query).order_by("-created_at")
            else:
                transactions = Transactions.objects.all().order_by("-created_at")
            paginator = CustomPagination()
            paginated_projects = paginator.paginate_queryset(transactions, request)
            transaction_serializer = TransectionSerializer(paginated_projects, many=True)
            return paginator.get_paginated_response(transaction_serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class PendingPayment(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        try:
            user = request.user
            search_query = request.query_params.get('search')  # e.g., "pending" or "completed"

            # Get all transactions by user, ordered latest first
            transactions_qs = Transactions.objects.filter(
                project__client__user=user,
                transaction_type="collection"
            ).select_related('bid', 'project').order_by('-created_at', '-id')

            # Get latest transaction per (bid_id, project_id)
            latest_per_pair = {}
            for txn in transactions_qs:
                key = (txn.bid_id, txn.project_id)
                if key not in latest_per_pair:
                    if txn.status.lower() == "failed":
                        continue  # Skip failed transaction
                    latest_per_pair[key] = txn

            # Now apply filtering if search is given
            filtered = list(latest_per_pair.values())
            if search_query in ["pending", "completed"]:
                filtered = [
                    txn for txn in filtered
                    if txn.status.lower() == search_query.lower()
                ]

            paginator = CustomPaginationTransition()
            paginated = paginator.paginate_queryset(filtered, request)
            serializer = TransectionSerializer(paginated, many=True)
            return paginator.get_paginated_response(serializer.data)

        except Exception as e:
            return Response({
                "status": "400",
                "message": "Failed",
                "type": "error",
                "data": {
                    "error": str(e)
                }
            }, status=status.HTTP_400_BAD_REQUEST)


class TransectionView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None, pk=None):
        try:
            transaction = Transactions.objects.exclude(
                Q(status="pending", transaction_type="collection") | Q(status=" ")
            )
            # transaction = Transactions.objects.all().exclude(Q(status="pending") & Q(transaction_type="collection")).exclude(status="failed")
            paginator = CustomPagination()
            paginated_projects = paginator.paginate_queryset(transaction, request)
            transaction_serializer = TransectionSerializer(paginated_projects, many=True)
            return paginator.get_paginated_response(transaction_serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            # transaction=Transactions.objects.filter(status="ongoing")#.exclude(bid__project__status="
            # transaction=Transactions.objects.exclude(status="completed")

class TransectionProjectView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None, pk=None):
        try:
            # transaction = Transactions.objects.filter(project__id=pk).exclude(Q(status="pending") & Q(transaction_type="collection"))
            transaction = Transactions.objects.filter(project__id=pk).exclude(
                Q(status="pending", transaction_type="collection") | Q(status=" ")
            )
            paginator = CustomPagination()
            paginated_projects = paginator.paginate_queryset(transaction, request)
            transaction_serializer = TransectionSerializer(paginated_projects, many=True)
            return paginator.get_paginated_response(transaction_serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)




# New Implementation
class CreateCheckoutSessionView(APIView):
    # permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            # amount = data.get('amount', 1000)
            # project_id = request.data.get(project_id, "")
            bid_id = request.data.get('bid_id', "")
            bid = Bid.objects.get(id = bid_id)
            bid_amount = round(float(bid.project_total_cost))
            print("bid_amount--", bid_amount)
            # amount=bid_id.get('project_total_cost', ' ')
            project_id = bid.project.id
            print("project_id", project_id)
            try:
                gateway=PaymentGatewayAPI()
                client_details={
                    "user_id":bid.project.client.id,
                }
                provider_details={
                    "user_id":bid.service_provider.id,

                }
                response=gateway.initialize_stripe_payment(bid.project_total_cost, 'usd', client_details, provider_details, bid.project.id)
                print(response)
                # payload = {'session_id': session.id, 'user_id': user_id, 'unit_amount': amount, 'currency': currency, 'project_id': project_id, 'bid_id': bid_id}
                with contextlib.suppress(Exception):
                    Transactions.objects.create(escrow_id=response.get("escrow_id"), project_id=bid.project.id, bid_id=bid.id, payment_type="stripe", status=' ') # project_id=project_id, bid_id=bid_id,
                if response:
                    return Response(response, status=status.HTTP_201_CREATED)
                    # return Response({'session_id': session.id, 'url': session.url, 'payment_indent':payment_indent.id, 'stripe_id': payment_indent.stripe_id, 'payment_status': payment_indent.status}, status=status.HTTP_201_CREATED)
                else:
                    return Response({'error': 'Failed to send session to Project B'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CheckPaymentStatus(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        data = request.data
        print(data)
        # user_id = request.user.id
        session_id = data.get('session_id')
        project_b_url = f"{ESCROW_BASE_API}/stripe/api/payment-status-view/{session_id}/"

        response = requests.get(project_b_url)


        if response.status_code == 200:
            return Response(response.json(), status=status.HTTP_200_OK)
        return Response({'error': 'Failed to fetch payment status'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TriggerPayoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            user_id = request.user.id
            print("user_id", user_id)
            payment_intent_id = request.data.get('payment_intent_id')
            bid_id = request.data.get('bid_id')
            project_id = Bid.objects.get(id=bid_id).project.id
            project_details = Project.objects.get(id=project_id).status
            user_id_db =  Bid.objects.get(id=bid_id).service_provider.id
            bank_details_stripe_id = BankDetails.objects.get(user_profile_id=user_id_db).stripe_account_id
            profile_details = Profile.objects.get(id=user_id_db)
            if profile_details.status == 'active':
                print("ok")
                bid_details = Bid.objects.get(id=bid_id)
                if not bid_id:
                    return Response({'error': 'Bid ID are required'}, status=status.HTTP_400_BAD_REQUEST)
                bid_details.status='Accepted'
                escrow_id = Transactions.objects.get(bid_id=bid_id).escrow_id
                transction_st = Transactions.objects.get(escrow_id=escrow_id)
                transction_status = Transactions.objects.get(escrow_id=escrow_id).status
                if project_details == 'completed' and transction_status == 'succeeded':
                    payout_amount = bid_details.project_total_cost
                    payout_amount = float(payout_amount)
                    payout_amount = round(payout_amount, 2)
                # if bid_details.id == user_id:
                #     bid_details.status = "Accepted"
                #     payout_amount = bid_details.payout_amount
                # project_b_url = f"{ESCROW_BASE_API}/stripe/api/release-escrow-payment/"
                project_b_url = "http://127.0.0.1:8000/stripe/api/stripe-bank-payout-check/"
                payload = {
                    "payment_intent_id": payment_intent_id,
                    "provider_account_id": bid_id,
                    "amount": payout_amount,
                    "currency": "eur",
                    'escrow_id': str(escrow_id),
                    "bid_id": bid_id,
                    "project_id": project_id,
                    'stripe_account_id': bank_details_stripe_id,
                    "metadata": {
                        "provider_account_id": bid_id
                    }
                }
                print("payload", payload)
                response = requests.post(project_b_url, json=payload)
                if response.status_code == 200:
                    transction_st.status = 'transfered'
                    transction_st.transaction_type = 'disbursement'
                    transction_st.save()
                    return Response({'message': 'Payout triggered successfully'}, status=status.HTTP_200_OK)
                else:
                    transction_st.status = 'failed'
                    transction_st.transaction_type = 'disbursement'
                    transction_st.save()
                    return Response({'error': 'Failed to trigger payout', 'details': response.json()}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class StripeBalanceAPIView(APIView):
    def get(self, request):
        """
        Get the balance of a Stripe connected account.
        """
        try:
            account_id = request.data.get('account_id', '')
            balance = stripe.Balance.retrieve(stripe_account=account_id)
            return Response(balance, status=status.HTTP_200_OK)
        except stripe.error.StripeError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class DeleteStripeAccountAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        try:
            account_id = request.data.get('account_id', '')
            stripe.Account.delete(account_id)
            return Response({"message": "Stripe account deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except stripe.error.InvalidRequestError:
            return Response({"error": "Account not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class PaymentHistoryApiView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        search_query=request.GET.get("search")
        transactions=Transactions.objects.filter(
            bid__service_provider=request.user.profile,
            transaction_type="disbursement",
            # status="completed"
        ).exclude(status__iexact=" ")
        if search_query:
            transactions=transactions.filter(Q(project__project_title__icontains=search_query)|Q(project__client__user__full_name__icontains=search_query))

        paginator = CustomPagination()
        paginated_transactions = paginator.paginate_queryset(transactions, request)
        transaction_serializer = TransectionSerializer(paginated_transactions, many=True)
        return paginator.get_paginated_response(transaction_serializer.data)
        # data=TransectionSerializer(transactions,many=True).data
        # return Response(data)


class SendPaymentRequestApiView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self,request):
        project_id=request.data.get("project_id")
        project=Project.objects.get(pk=project_id)
        # bid=project.bid.filter(service_provider=request.user,status="Accepted").first()
        notification=Notification.objects.create(
            sender=request.user.profile,
            receiver=project.client,
            title="Payment request for project",
            message="A payment request has been created for ",
            object_type = "payment request",
            project_id = project_id,
            bid_id = None
        )
        notification.send_to_token(extra_data={"project":json.dumps(ProjectSerializer(project).data),"notification_type":"payment_request"})
        return Response({"message":"Payment request sent to client"})

class PaymentFailerView(APIView):
    def put(self, request, bid_id):
        # bid_id = request.data.get('bid_id')

        if not bid_id:
            return Response({'error': 'Bid ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        if not Bid.objects.filter(id=bid_id).exists():
            return Response({'error': 'Invalid bid_id'}, status=status.HTTP_404_NOT_FOUND)

        transaction = Transactions.objects.filter(bid_id=bid_id).last()
        #transaction.status = current_transaction
        transaction.status = 'failed'
        transaction.save()

        return Response({
            'message': 'Transaction Failed',
            'status': transaction.status
        }, status=status.HTTP_200_OK)




@method_decorator(csrf_exempt, name="dispatch")
class OrangePaymentView(APIView):

    @swagger_auto_schema(
        operation_summary="Initialize Orange payment for a bid",
        operation_description="Create an Orange Money collection request for the selected bid and update bid payment state.",
        manual_parameters=[
            openapi.Parameter(
                'Authorization',
                openapi.IN_HEADER,
                description="Authorization token (Bearer Token)",
                type=openapi.TYPE_STRING,
                required=True
            ),
        ],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['bid_id', 'subscriberMsisdn'],
            properties={
                'bid_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='Accepted bid id'),
                'subscriberMsisdn': openapi.Schema(type=openapi.TYPE_STRING, description='Cameroon Orange Money number without country code'),
                'description': openapi.Schema(type=openapi.TYPE_STRING, description='Payment description'),
            },
        ),
        responses={
            200: "Orange payment initialized successfully",
            400: "Invalid request",
            404: "Bid not found",
            500: "Server error"
        }
    )

    def post(self, request):
        bid_id = request.data.get("bid_id")
        subscriberMsisdn = request.data.get("subscriberMsisdn")
        description = request.data.get("description", "Payment")
        payment_type = request.data.get("payment_type", "orange_project")
        user_id = request.data.get("user_id")

        if not bid_id or not subscriberMsisdn:
            return Response(
                {"error": "bid_id and subscriberMsisdn are required"},
                status=400
            )

        try:
            bid = get_object_or_404(Bid, id=bid_id)
            amount = float(str(bid.project_total_cost).replace(",", "").strip())

        except (TypeError, ValueError):
            return Response({"error": "Invalid bid price"}, status=400)

        if amount < 10:
            return Response({"error": "Orange amount must be at least 10 FCFA."}, status=400)

        try:
            phone_number = _normalize_orange_msisdn(subscriberMsisdn)
        except ValueError as exc:
            return Response({"error": str(exc)}, status=400)

        data = {
            "amount": amount,
            "subscriberMsisdn": phone_number,
            "description": description,
            "payment_type": payment_type,
            "project_id": bid.project.id,
            "bid_id": bid.id,
            "user_id": user_id or request.user.id,
        }

        try:
            gateway = PaymentGatewayAPI()
            response_data = gateway.initialize_orange_payment(data)
            if not response_data:
                return Response({"error": "Orange payment initialization failed"}, status=502)
            if response_data.get("success") is False:
                return Response(
                    {
                        "error": response_data.get("message", "Orange payment initialization failed"),
                        "orange_response": response_data,
                    },
                    status=502,
                )

            payment_status = str(
                response_data.get("status")
                or response_data.get("payment_status")
                or response_data.get("message", "")
            ).lower()

            transaction_status = "failed"
            if payment_status in {"pending", "initiated", "in_progress", "processing"}:
                transaction_status = "pending"
                Bid.objects.filter(project=bid.project).exclude(id=bid.id).update(status='Rejected', is_accepted=False)
            elif payment_status in {"success", "successful", "succeeded"} or response_data.get("result") is True:
                transaction_status = "completed"
                """
                Project/bid payment referral rewards are intentionally disabled.
                If business confirms Orange project payments should count as
                referrals, call the project-payment referral helper here.
                """
                # handle_successful_referral_project_payment(
                #     payer_user=bid.project.client.user,
                #     amount=bid.project_total_cost,
                #     provider="orange_project_collection",
                # )

            transaction_obj = Transactions.objects.create(
                bid=bid,
                status=transaction_status,
                project=bid.project,
                transaction_type="collection",
                payment_type="orange",
                external_order_id=response_data.get("orderId"),
                payment_token=response_data.get("payToken"),
                gateway_transaction_id=str(response_data.get("orangeTransactionId") or "") or None,
            )

            if transaction_status == "completed":
                _sync_orange_project_payment(
                    {
                        **response_data,
                        "bid_id": bid.id,
                        "project_id": bid.project.id,
                    },
                    forced_status="SUCCESS",
                )

            return Response({
                "payment_response": response_data,
                "bid": BidSerializer(bid).data,
                "transaction_id": transaction_obj.id,
            })

        except Exception as e:
            return Response({"error": str(e)}, status=500)


@method_decorator(csrf_exempt, name="dispatch")
class OrangePaymentStatusView(APIView):

    def get(self, request, txn_id):   # 👈 yaha receive karo
        if not txn_id:
            return Response(
                {"error": "txn_id is required"},
                status=400
            )

        # data = {
        #     "txn_id": txn_id
        # }

        try:
            gateway = PaymentGatewayAPI()
            response_data = gateway.get_orange_payment_status(txn_id)
            if not response_data:
                return Response({"error": "Orange payment status lookup failed"}, status=502)
            if isinstance(response_data, dict):
                sync_result = _sync_orange_project_payment(
                    response_data,
                    forced_status=response_data.get("status"),
                )
                response_data["trustwork_sync"] = sync_result
            return Response(response_data)

        except Exception as e:
            return Response({"error": str(e)}, status=500)


@method_decorator(csrf_exempt, name="dispatch")
class OrangeApiPaymentStatusView(APIView):

    def get(self, request, pay_token):
        if not pay_token:
            return Response(
                {"error": "txn_id is required"},
                status=400
            )

        # data = {
        #     "txn_id": txn_id
        # }

        try:
            gateway = PaymentGatewayAPI()
            response_data = gateway.get_apiorange_payment_status(pay_token)
            if not response_data:
                return Response({"error": "Orange API payment status lookup failed"}, status=502)
            if isinstance(response_data, dict):
                sync_result = _sync_orange_project_payment(
                    {"pay_token": pay_token, **response_data},
                    forced_status=response_data.get("status"),
                )
                response_data["trustwork_sync"] = sync_result
            return Response(response_data)

        except Exception as e:
            return Response({"error": str(e)}, status=500)


@method_decorator(csrf_exempt, name="dispatch")
class OrangePaymentSuccessView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        payload = request.data if isinstance(request.data, dict) else {}
        sync_result = _sync_orange_project_payment(payload, forced_status=payload.get("status") or "SUCCESS")
        status_code = status.HTTP_200_OK if sync_result.get("updated") else status.HTTP_404_NOT_FOUND
        return Response(sync_result, status=status_code)
