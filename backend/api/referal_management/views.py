from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from customuser.models import CustomUser
from profile_management.models import AppReferContent, Profile

from .serializers import AppReferSerializer


class ReferalHandlerView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        """
        take referal_id and assign that to the request.user
        """
        referal_code=(request.data.get("referal_code","") or "").strip()
        if not referal_code:
            return Response({"message":"Referal code is required"}, status=status.HTTP_400_BAD_REQUEST)

        referer_user=CustomUser.objects.filter(user_referal_code=referal_code).last()
        if referer_user:
            if referer_user==request.user:
                return Response({"message":"Cannot use your own referal code"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                if request.user.referred_by_code:
                    return Response({"message":"User already has referal code."}, status=status.HTTP_400_BAD_REQUEST)

                request.user.referred_by_code=referal_code
                request.user.save(update_fields=["referred_by_code"])
                return Response({"message":"Referal added."})

        else:
            return Response({"message":"Invalid Referal code"}, status=status.HTTP_400_BAD_REQUEST)


    def get(self,request,id=None):
        """Returns the referal code of a particular user
        """
        if id:
            profile = Profile.objects.filter(id=id).first()
            if not profile:
                return Response({"message":"Profile not found"}, status=status.HTTP_404_NOT_FOUND)
            user=profile.user
        else:
            user=request.user
        return Response(_user_referral_summary(user))


def _user_referral_summary(user):
    return {
        "user_referal_code": user.user_referal_code,
        "referred_by_code": user.referred_by_code,
        "total_referal_count": user.total_referal_count,
        "total_referal_amount": user.total_referal_amount,
        "is_discount": user.is_discount,
    }


def _referral_content_data(referral):
    return {
        "id": referral.id,
        "content": referral.content,
        "icon": referral.icon.url if referral.icon else None,
    }

class AppReferView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self, request, pk=None):
        try:
            if pk:
                referral = AppReferContent.objects.filter(id=pk).first()
                if not referral:
                    return Response({"error": "Referral Content not found"}, status=status.HTTP_404_NOT_FOUND)

                serializer = AppReferSerializer(referral)
                data = serializer.data
                if referral.icon:
                    # data['icon'] = request.build_absolute_uri(referral.icon.url)
                    data['icon'] = referral.icon.url
                data.update(_user_referral_summary(request.user))
                return Response(data, status=status.HTTP_200_OK)
            else:
                referrals = AppReferContent.objects.all()
                referral_summary = _user_referral_summary(request.user)
                if not referrals.exists():
                    return Response([{**referral_summary}], status=status.HTTP_200_OK)

                data = [
                    {
                        **_referral_content_data(referral),
                        **referral_summary,
                    }
                    for referral in referrals
                ]
                return Response(data, status=status.HTTP_200_OK)
        except Exception:
            return Response({"error": "Something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        serializer = AppReferSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            data = serializer.data
            if 'icon' in request.FILES:
                data['icon'] = request.build_absolute_uri(serializer.instance.icon.url)
            return Response(data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        try:
            referral = AppReferContent.objects.filter(id=pk).first()
            if not referral:
                return Response({"error": "Referral Content not found"}, status=status.HTTP_404_NOT_FOUND)

            serializer = AppReferSerializer(referral, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                data = serializer.data
                if referral.icon:
                    data['icon'] = request.build_absolute_uri(referral.icon.url)
                return Response(data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception:
            return Response({"error": "Something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, pk=None):
        try:
            if not pk:
                return Response({"error": "Referral ID (pk) is required"}, status=status.HTTP_400_BAD_REQUEST)
            referral = AppReferContent.objects.get(id=pk)
            referral.delete()
            return Response({"message": "Referral Content deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except AppReferContent.DoesNotExist:
            return Response({"error": "Referral Content not found"}, status=status.HTTP_404_NOT_FOUND)
