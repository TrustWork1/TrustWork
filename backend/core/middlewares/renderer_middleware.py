from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.utils.serializer_helpers import ReturnDict, ReturnList


def _message_from_value(value):
    if value is None:
        return ""
    if isinstance(value, (list, tuple, ReturnList)):
        return _message_from_value(value[0]) if value else ""
    if isinstance(value, (dict, ReturnDict)):
        for key in ("error", "detail", "message", "non_field_errors"):
            message = _message_from_value(value.get(key))
            if message:
                return message
        for message in value.values():
            message = _message_from_value(message)
            if message:
                return message
        return ""
    return str(value)


def _response_message(data, default_message, is_error=False):
    if not isinstance(data, (dict, ReturnDict)):
        message = _message_from_value(data)
        return message or default_message

    keys = ("error", "detail", "message", "non_field_errors") if is_error else ("message", "detail")
    for key in keys:
        message = _message_from_value(data.get(key))
        if message:
            return message

    message = _message_from_value(data)
    return message or default_message


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

            is_success = 200 <= response.status_code < 300
            custom_response = {
                'status': str(200 if 200 <= response.status_code < 300 else response.status_code),
                'message': _response_message(
                    response.data,
                    'Success' if is_success else 'Failed',
                    is_error=not is_success,
                ),
                'type': 'success' if 200 <= response.status_code <= 300 else 'error',
                'data': response.data
            }
            response.data = custom_response
            response.content = response.rendered_content
            response.status_code=200 if 200 <= response.status_code < 300 else response.status_code
        return response
