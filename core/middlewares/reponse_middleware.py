from django.utils.deprecation import MiddlewareMixin
from rest_framework.response import Response

class ResponseMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        if isinstance(response, Response):
            response.render()
            custom_response = {
                'status': str(response.status_code),
                'message': response.status_text,
                'type': 'success' if 200 <= response.status_code < 300 else 'error',
                'data': response.data
            }
            return Response(custom_response, status=response.status_code)

        return response