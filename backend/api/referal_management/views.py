from rest_framework.views import APIView
from profile_management.models import Profile
from rest_framework.permissions import IsAuthenticated
from customuser.models import CustomUser
from rest_framework.response import Response


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