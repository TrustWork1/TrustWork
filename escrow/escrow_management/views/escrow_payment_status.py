from rest_framework.views import APIView
from rest_framework.response import Response
from escrow_management.models import *
import json
import re
from rest_framework import status
from uuid import UUID
from django.utils import timezone
from payment_handler.payment_gateways.MTN_MoMo.collection import MtnMoMoCollection


class EscrowTransactionStatus(APIView):
    def put(self, request, escrow_id):
        try:
            try:
                escrow_uuid = UUID(escrow_id)
            except ValueError:
                return Response({"error": "Invalid escrow ID"}, status=status.HTTP_400_BAD_REQUEST)

            try:
                escrow = Escrow.objects.get(id=escrow_uuid)
                reference_id=escrow.reference_id
            except Escrow.DoesNotExist:
                return Response({"error": "Escrow not found"}, status=status.HTTP_404_NOT_FOUND)

            # Update transaction if exists
            transaction = (
                Transactions.objects.filter(escrow=escrow, transaction_type="collection", status="pending").order_by("-created_at").first()
            )

            collection=MtnMoMoCollection()
            status_response=collection.getTransactionStatus(reference_id)
            payment_status = status_response.get('status')
            reason = status_response.get('reason')

            if payment_status.upper() == "FAILED":
                # Update escrow
                escrow.status = "collection_failed"
                escrow.collection_date = timezone.now()
                escrow.save()

                if transaction:
                    transaction.status = "failed"
                    transaction.save()

                # Create event log
                Events.objects.create(
                    event_type="collection_failed",
                    event_description=f"MTN Collection from backend with status: {reason}",
                    escrow=escrow
                )

            return Response({"message": "Transaction status changed", "status_response":status_response}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)