from rest_framework.response import Response
from rest_framework.utils.serializer_helpers import ReturnDict, ReturnList
from django.http import JsonResponse

class CustomFinalResponseMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        bypass_list=['/swagger/']
        response = self.get_response(request)
        if request.path in bypass_list or 'static' in request.path:
            return response
        # response = self.get_response(request)
        print(response.status_code)
        if response.status_code == 500:
            return JsonResponse(
                {
                    "status": 500,
                    "data":{"error": "An unknown error occurred. Please try again later."},
                    "type": "error",
                },
                status=500
            )
        if isinstance(response, Response):
            if isinstance(response.data, (ReturnDict, ReturnList)):
                response.render()
            if isinstance(response.data, dict) and all(key in response.data for key in ['status', 'type', 'message', 'data']):
                return response

            custom_response = {
                'status': str(200 if 200 <= response.status_code < 300 else response.status_code),
                'message': 'Success' if 200 <= response.status_code < 300 else 'Failed',
                'type': 'success' if 200 <= response.status_code <= 300 else 'error',
                'data': response.data
            }
            response.data = custom_response
            response.content = response.rendered_content
            response.status_code=200 if 200 <= response.status_code < 300 else response.status_code
        return response