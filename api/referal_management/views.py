from rest_framework.views import APIView
from profile_management.models import Profile, AppReferContent
from rest_framework.permissions import IsAuthenticated
from customuser.models import CustomUser
from rest_framework.response import Response
from .serializers import AppReferSerializer
from rest_framework import status


class ReferalHandlerView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        """
        take referal_id and assign that to the request.user 
        """
        referal_code=request.data.get("referal_code","")
        referer_user=CustomUser.objects.filter(user_referal_code=referal_code).last()
        if referer_user:
            if referer_user==request.user:
                return Response({"message":"Cannot use your own referal code"})
            else:
                if request.user.referred_by_code:
                    return Response({"message":"User already has referal code."})
                    
                request.user.referred_by_code=referal_code
                request.user.save()
                return Response({"message":"Referal added."})
                
        else:
            return Response({"message":"Invalid Referal code"})
            
                
    def get(self,request,id=None):
        """Returns the referal code of a particular user
        """
        user=Profile.objects.get(id=id).user
        return Response({"user_referal_code":user.user_referal_code,"referred_by_code":user.referred_by_code})

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
                return Response(data, status=status.HTTP_200_OK)
            else:
                referrals = AppReferContent.objects.all()
                if not referrals.exists():
                    return Response([], status=status.HTTP_200_OK)

                data = [
                    {
                        "id": referral.id,
                        "content": referral.content,
                        # "icon": request.build_absolute_uri(referral.icon.url) if referral.icon else None
                        "icon": referral.icon.url
                    }
                    for referral in referrals
                ]
                return Response(data, status=status.HTTP_200_OK)
        except:
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

        except:
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