# In your Django views
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import stripe
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from escrow_management.models import StripePayment
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import AllowAny
from django.shortcuts import redirect
# from .utils import handle_checkout_session_completed

stripe.api_key = settings.STRIPE_SECRET_KEY

def handle_checkout_session_completed(event, bid):
    session = event['data']['object']
    session_id = session['id']
    bid_id = bid

    payment = StripePayment.objects.filter(session_id=session_id, bid_id=bid_id).first()
    if payment:
        payment.status = 'succeeded'
        payment.save()

    return {'message': 'Payment successfully'}

class ProcessStripeSession(APIView):
    def post(self, request):
        session_id = request.data.get('session_id')
        bid_id = request.data.get('bid_id')
        # user_id = request.user.id
        if not session_id and bid_id:
            return Response({'error': 'Session ID & Bid ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        # if bid_id.status == "Accepted":
        event = {
            'type': 'checkout.session.completed',
            'data': {
                'object': {
                    'id': session_id
                }
            }
        }
        response = handle_checkout_session_completed(event, bid_id)

        return Response(response, status=status.HTTP_200_OK)

