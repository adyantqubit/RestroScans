"""Turn unexpected API errors into JSON the React apps can show to a person.

DRF already formats its own exceptions (validation, 401, 403, 404). Anything else
used to escape as an HTML 500 page. The full traceback still goes to the log.
"""

import logging

from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist, ValidationError as DjangoValidationError
from django.db import IntegrityError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler

logger = logging.getLogger('custom_logger')


def _body(message, detail=None):
    body = {'success': False, 'message': message, 'error': message}
    if detail and settings.DEBUG:
        body['detail'] = detail
    return body


def api_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is not None:
        # The React apps read ``message``; DRF's own errors only carry ``detail``.
        if isinstance(response.data, dict) and 'message' not in response.data and 'detail' in response.data:
            response.data['message'] = str(response.data['detail'])
        return response

    view = context.get('view')
    view_name = type(view).__name__ if view is not None else 'unknown view'

    if isinstance(exc, DjangoValidationError):
        errors = exc.message_dict if hasattr(exc, 'error_dict') else {'non_field_errors': exc.messages}
        first = next((messages[0] for messages in errors.values() if messages), 'Please check the details.')
        body = _body(first)
        body['errors'] = errors
        return Response(body, status=status.HTTP_400_BAD_REQUEST)
    if isinstance(exc, ObjectDoesNotExist):
        return Response(_body('The requested record was not found.', str(exc)), status=status.HTTP_404_NOT_FOUND)
    if isinstance(exc, KeyError):
        field = str(exc).strip("'\"")
        return Response(_body(f'Missing required field: {field}.', repr(exc)), status=status.HTTP_400_BAD_REQUEST)
    if isinstance(exc, IntegrityError):
        logger.warning('integrity error in %s: %s', view_name, exc)
        return Response(_body('This record conflicts with existing data.', str(exc)), status=status.HTTP_409_CONFLICT)

    logger.exception('unhandled error in %s', view_name)
    return Response(
        _body('Something went wrong. Please try again.', repr(exc)),
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
