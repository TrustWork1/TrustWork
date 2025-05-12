from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView,Http404
from rest_framework.permissions import IsAuthenticated
from api.pagination import CustomPagination, CustomPaginationProjectProfile
from django.shortcuts import get_object_or_404
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import generics
from payment_handle.gateways.MTN import Collection
from profile_management.models import MembershipPlans
from api.profile.serializers import ProfilePaymentStatusSerializer,Profile
from api.project.serializers import Project, ProjectSerializer, TransectionSerializer
from project_management.models import Bid
from project_management.models import Transactions
# from payment.models import PaymentRequest
# from payment.serializers import PaymentRequestSerializer
from rest_framework import viewsets, status
from rest_framework.decorators import action
import uuid
from django.core.exceptions import ValidationError
from uuid import uuid4
from rest_framework import status, permissions
from profile_management.models import BankDetails
import stripe
import requests, os
from payment_handle.gateways.escrow import PaymentGatewayAPI
from django.conf import settings
stripe.api_key = settings.STRIPE_TEST_SECRET_KEY
from django.http import JsonResponse
from django.db.models import Q


BASE_URL='https://trustwork-escrow.dedicateddevelopers.us'
LOCAL_BASE_URL="http://127.0.0.1:8000"
BASE_FRONTEND_URL = os.getenv("BASE_FRONTEND_URL", "http://localhost:8001")

# Dev Cred

STRIPE_PUBLIC_KEY = os.getenv("STRIPE_PUBLIC_KEY")
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_TEST_WEBHOOK_SECRET")

def collection(amount,mobile_number,external_id):
    coll = Collection()
    response = coll.requestToPay(amount=amount,phone_number=mobile_number,external_id=external_id)
    status_resposne = coll.getTransactionStatus(response['ref'])
    print(status_resposne)
    if status_resposne.get("status") == "SUCCESS":
        pass #Do something here
    
    return status_resposne.get("status")

# collection(100,mobile_number="swapnil.chopra@webskitters.in")

class PaymentApiView(APIView):
    def post(self,request):
        mobile_number=request.data.get("phone_number",0)
        plan=request.data.get("subscription_plan_id")
        if len(mobile_number)>=10 and len(mobile_number)<15:
            # plan_obj=MembershipPlans.objects.filter(id=plan).first()
            # if plan_obj:
            #     payment_response=collection(plan_obj.plan_price,mobile_number,f"{str(uuid4())}")
            #     if payment_response=="SUCCESSFUL":
            profile = Profile.objects.get(user__id=request.user.id)
            serializer = ProfilePaymentStatusSerializer(profile, data={"is_payment_verified":True})
            if serializer.is_valid():
                serializer.save()
            #     return Response({"payment":payment_response})
            return Response({"payment":"Success"},status=status.HTTP_200_OK)
        return Response({"error":"Please enter correct mobile number"},status=status.HTTP_400_BAD_REQUEST)

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
    def get(self, request, format=None, pk=None):
        try:
            # transaction=Transactions.objects.filter(status="ongoing").exclude(bid__project__status="completed") #Project.objects.filter(status='active'))
            # transaction=Transactions.objects.exclude(status="completed")
            # if transaction:
            data = request.data
            user_id = request.user
            search_query = request.query_params.get('search', '')
            if search_query:
                transaction= Transactions.objects.filter(status__icontains=search_query,project__client__user = user_id).order_by("-created_at")
            else:
                transaction = Transactions.objects.filter(project__client__user = user_id).order_by("-created_at")
            paginator = CustomPagination()
            paginated_projects = paginator.paginate_queryset(transaction, request)
            transaction_serializer = TransectionSerializer(paginated_projects, many=True)
            return paginator.get_paginated_response(transaction_serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class TransectionView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None, pk=None):
        try:
            # transaction = Transactions.objects.select_related('bid', 'bid__project').all()
            transaction = Transactions.objects.all()
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
            transaction = Transactions.objects.filter(project__id=pk)
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
            data = request.data
            # amount = data.get('amount', 1000)
            currency = data.get('currency', 'usd')
            user_id = request.user.id
            # project_id = request.data.get(project_id, "")
            bid_id = request.data.get('bid_id', "")
            bid = Bid.objects.get(id = bid_id)
            bid_amount = round(float(bid.project_total_cost))
            print("bid_amount--", bid_amount)
            # amount=bid_id.get('project_total_cost', ' ')
            project_id = Bid.objects.get(id=bid_id).project.id
            print("project_id", project_id)
            if project_id:
                project = Project.objects.get(id=project_id)
                print("project", project)
                project.status=='ongoing'
                amount1 = project.project_budget
                amount = bid_amount
                # Project.objects.get(project_id, status='ongoing')
            try:
                gateway=PaymentGatewayAPI()
                client_details={
                    "user_id":bid.project.client.id,
                }
                provider_details={
                    "user_id":bid.service_provider.id,

                }
                response=gateway.initialize_stripe_payment(bid.project_total_cost,'usd',client_details,provider_details,bid.project.id)
                print(response)
                # payload = {'session_id': session.id, 'user_id': user_id, 'unit_amount': amount, 'currency': currency, 'project_id': project_id, 'bid_id': bid_id}
                try:
                    payment = Transactions.objects.create(escrow_id=response.get("escrow_id"), project_id=bid.project.id, bid_id=bid.id, status='in_progress') # project_id=project_id, bid_id=bid_id,
                except:
                    pass
                if response:
                    return Response(response, status=status.HTTP_201_CREATED)
                    # return Response({'session_id': session.id, 'url': session.url, 'payment_indent':payment_indent.id, 'stripe_id': payment_indent.stripe_id, 'payment_status': payment_indent.status}, status=status.HTTP_201_CREATED)
                else:
                    return Response({'error': 'Failed to send session to Project B'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    

    # def post(self, request):
    #     try:
    #         data = request.data
    #         amount = data.get('amount', 1000)
    #         currency = data.get('currency', 'usd')
    #         user_id = request.user.id
    #         # project_id = request.data.get(project_id, "")
    #         # bid_id = request.data.get('bid_id', "")
    #         # amount=bid_id.get('project_total_cost', ' ')
    #         # project_id = Bid.objects.get(id=id).project.id
    #         # print("project_id", project_id)
    #         # if project_id:
    #         #     project_id.status=='ongoing'
    #         #     amount = project_id.get('project_budget', ' ')
    #             # Project.objects.get(project_id, status='ongoing')
    #         try:
    #             session = stripe.checkout.Session.create(
    #                 payment_method_types=['card'],
    #                 line_items=[{
    #                     'price_data': {
    #                         'currency': currency,
    #                         'product_data': {'name': 'Service Payment'},
    #                         'unit_amount': amount,
    #                         # 'payment_method':['card'],
    #                         # 'capture_method':'manual',
    #                     },
    #                     'quantity': 1,
    #                 }],
    #                 mode='payment',
    #                 # success_url="https://trustwork-escrow.dedicateddevelopers.us/stripe/api/process-stripe-session/payment-success/",
    #                 success_url="http://127.0.0.1:8000/stripe/api/process-stripe-session/payment-success/",
    #                 # cancel_url="https://trustwork-escrow.dedicateddevelopers.us/stripe/api/process-stripe-session/payment-failed/",
    #                 cancel_url="http://127.0.0.1:8000/stripe/api/process-stripe-session/payment-failed/",
    #                 metadata={'user_id': user_id} 
    #             )
    #             print("session", session)


    #             # project_b_url = "https://trustwork-escrow.dedicateddevelopers.us/stripe/api/process-stripe-session/"
    #             project_b_url = "http://127.0.0.1:8001/stripe/api/process-stripe-session/"
    #             payload = {'session_id': session.id, 'user_id': user_id, 'unit_amount': amount, 'currency': currency}
    #             response = requests.post(project_b_url, json=payload)

    #             if response.status_code == 200:
    #                 return Response({'session_id': session.id, 'url': session.url}, status=status.HTTP_201_CREATED)
    #             else:
    #                 return Response({'error': 'Failed to send session to Project B'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    #         except Exception as e:
    #             return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    #     except Exception as e:
    #         return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CheckPaymentStatus(APIView):
    permission_classes = [permissions.IsAuthenticated] 

    def get(self, request):
        data = request.data
        print(data)
        # user_id = request.user.id
        session_id = data.get('session_id')
        project_b_url = f"https://trustwork-escrow.dedicateddevelopers.us/stripe/api/payment-status-view/{session_id}/"
        # project_b_url = f"http://127.0.0.1:8001/stripe/api/payment-status-view/{session_id}/"
        
        response = requests.get(project_b_url)


        if response.status_code == 200:
            return Response(response.json(), status=status.HTTP_200_OK)
        return Response({'error': 'Failed to fetch payment status'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class TriggerPayoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            data = request.data
            user_id = request.user.id
            print("user_id", user_id)
            payment_intent_id = request.data.get('payment_intent_id')
            bid_id = request.data.get('bid_id')
            project_id = Bid.objects.get(id=bid_id).project.id
            project_details = Project.objects.get(id=project_id).status
            user_id_db =  Bid.objects.get(id=bid_id).service_provider.id
            bank_details_stripe_id = BankDetails.objects.get(user_profile_id=user_id_db).stripe_account_id
            profile_details = Profile.objects.get(id=user_id_db)
            if profile_details:
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
                    # project_b_url = "https://trustwork-escrow.dedicateddevelopers.us/stripe/api/release-escrow-payment/"
                    project_b_url = "http://127.0.0.1:8000/stripe/api/stripe-bank-payout-check/"
                    payload = {
                        "payment_intent_id": payment_intent_id,
                        "provider_account_id": bid_id,
                        "amount": payout_amount,
                        "currency": "usd",
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
        transactions=Transactions.objects.filter(bid__service_provider=request.user.profile)
        if search_query:
            transactions=transactions.filter(Q(project__project_title__icontains=search_query)|Q(project__client__user__full_name__icontains=search_query))
            
        paginator = CustomPagination()
        paginated_transactions = paginator.paginate_queryset(transactions, request)
        transaction_serializer = TransectionSerializer(paginated_transactions, many=True)
        return paginator.get_paginated_response(transaction_serializer.data)
        # data=TransectionSerializer(transactions,many=True).data
        # return Response(data)
from chat_management.models import Notification
import json

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
                        message="A patment request has been created for "
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
        current_transaction = transaction.status
        #transaction.status = current_transaction
        transaction.status = 'failed'
        transaction.save()
        
        return Response({
            'message': 'Transaction Failed',
            'status': transaction.status
        }, status=status.HTTP_200_OK)
    