from rest_framework.renderers import JSONRenderer

class CustomRenderer(JSONRenderer):
    def render(self, data, accepted_media_type=None, renderer_context=None):
        response = renderer_context.get('response', None)
        status_code = response.status_code if response else 200
        
        custom_response = {
            'status': str(status_code),
            'message': response.status_text if response else 'OK',
            'type': 'success' if 200 <= status_code < 300 else 'error',
            'data': data
        }
        
        return super().render(custom_response, accepted_media_type, renderer_context)
