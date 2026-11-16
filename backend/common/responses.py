from rest_framework.response import Response


def api_response(success, message='', data=None, status_code=200, extra=None):
    body = {
        'success': success,
        'message': message,
        'data': data if data is not None else {},
    }
    if extra:
        body.update(extra)
    return Response(body, status=status_code)
