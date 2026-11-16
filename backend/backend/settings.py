"""Django settings for RestroScans.

Every value that differs between machines or environments is read from
``backend/.env`` (see ``.env.example``). Source code never needs to change when
moving between local development and production.
"""

import logging
import logging.config
import os
from pathlib import Path

from django.core.exceptions import ImproperlyConfigured
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / '.env')


def env(name, default=None):
    value = os.environ.get(name)
    if value is None or str(value).strip() == '':
        return default
    return value.strip()


def env_bool(name, default=False):
    value = env(name)
    if value is None:
        return default
    return value.lower() in ('1', 'true', 'yes', 'on')


def env_int(name, default):
    value = env(name)
    return int(value) if value is not None else default


def env_list(name, default=''):
    raw = env(name, default) or ''
    return [item.strip() for item in raw.split(',') if item.strip()]


def required_secret(name, local_default):
    """Secrets may fall back to a placeholder only while DEBUG is on."""
    value = env(name)
    if value:
        return value
    if DEBUG:
        return local_default
    raise ImproperlyConfigured(f'{name} must be set in backend/.env when DEBUG=False.')


# --- Core ---------------------------------------------------------------------

DEBUG = env_bool('DEBUG', False)
SECRET_KEY = required_secret('DJANGO_SECRET_KEY', 'django-insecure-local-only-change-me')

HTTP_METHOD = env('HTTP_METHOD', 'http://')
BASE_DOMAIN = env('BASE_DOMAIN', 'restroscans.com')
# Path prefix used by the public auth endpoints: /admin_app/<DOMAIN_NAME>/login/
DOMAIN_NAME = env('DOMAIN_NAME', 'restroscans')

ALLOWED_HOSTS = env_list('ALLOWED_HOSTS', '*' if DEBUG else f'.{BASE_DOMAIN},{BASE_DOMAIN}')

# The customer site of a restaurant, encoded in its QR code.
TENANT_SITE_URL_TEMPLATE = env('TENANT_SITE_URL_TEMPLATE', HTTP_METHOD + '{tenant}.' + BASE_DOMAIN + '/')
# Where the API (and therefore /media/) of a restaurant is reachable from a browser.
TENANT_API_URL_TEMPLATE = env('TENANT_API_URL_TEMPLATE', HTTP_METHOD + '{domain}:8000')

SHARED_APPS = [
    'tenant_schemas',
    'admin_app',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.admin',
    'django.contrib.auth',
]

TENANT_APPS = [
    'tenant_app',
    'django.contrib.contenttypes',
    'django.contrib.auth',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.admin',
]

INSTALLED_APPS = [
    'tenant_schemas',
    'admin_app',
    'tenant_app',
    'django.contrib.contenttypes',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'admin_volt.apps.AdminVoltConfig',
    'ckeditor',
    'fcm_django',
]

PUBLIC_SCHEMA_NAME = 'public'
PUBLIC_SCHEMA_URLCONF = 'backend.urls'
ROOT_URLCONF = 'backend.urls'
TENANT_MODEL = 'admin_app.Tenant'
# Seconds a restaurant lookup is cached per process (cleared whenever a Tenant is saved). 0 disables it.
TENANT_CACHE_SECONDS = env_int('TENANT_CACHE_SECONDS', 30)
DEFAULT_FILE_STORAGE = 'tenant_schemas.storage.TenantFileSystemStorage'

MIDDLEWARE = [
    # First, so CORS headers are present even on responses produced by the tenant middleware.
    'corsheaders.middleware.CorsMiddleware',
    'admin_app.middlewares.MutitenantMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'
ASGI_APPLICATION = 'backend.asgi.application'

# --- Database -----------------------------------------------------------------

DATABASES = {
    'default': {
        'ENGINE': 'tenant_schemas.postgresql_backend',
        'NAME': env('DB_NAME', 'restroscans'),
        'USER': env('DB_USER', 'postgres'),
        'PASSWORD': env('DB_PASSWORD', ''),
        'HOST': env('DB_HOST', 'localhost'),
        'PORT': env('DB_PORT', '5432'),
        'CONN_MAX_AGE': env_int('DB_CONN_MAX_AGE', 0),
    }
}
DATABASE_ROUTERS = ('tenant_schemas.routers.TenantSyncRouter',)
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# --- REST API -----------------------------------------------------------------

REST_FRAMEWORK = {
    # Staff calls are authenticated by MutitenantMiddleware with the restaurant JWT.
    # Session/Basic authentication would only add CSRF failures for the React apps.
    'DEFAULT_AUTHENTICATION_CLASSES': [],
    'EXCEPTION_HANDLER': 'common.exceptions.api_exception_handler',
}

JWT_ACCESS_SECRET = required_secret('JWT_ACCESS_SECRET', 'local-access-secret')
JWT_REFRESH_SECRET = required_secret('JWT_REFRESH_SECRET', 'local-refresh-secret')
# The admin panel keeps tokens in localStorage, so the access token is short-lived and silently
# renewed from the refresh token (see admin_panel/src/http/http_client.jsx).
JWT_ACCESS_HOURS = env_int('JWT_ACCESS_HOURS', 2)
JWT_REFRESH_DAYS = env_int('JWT_REFRESH_DAYS', 7)

# Only needed to read waiter passwords stored by older versions (reversible encryption).
ENCRYPT_KEY = (env('ENCRYPT_KEY', '') or '').encode('utf-8')

# --- CORS / CSRF / security ---------------------------------------------------

CORS_ALLOW_ALL_ORIGINS = env_bool('CORS_ALLOW_ALL_ORIGINS', DEBUG)
CORS_ALLOWED_ORIGINS = env_list('CORS_ALLOWED_ORIGINS')
CORS_ALLOWED_ORIGIN_REGEXES = env_list(
    'CORS_ALLOWED_ORIGIN_REGEXES',
    r'^https?://([a-z0-9-]+\.)?' + BASE_DOMAIN.replace('.', r'\.') + '$',
)
CORS_ALLOW_CREDENTIALS = env_bool('CORS_ALLOW_CREDENTIALS', True)
from corsheaders.defaults import default_headers  # noqa: E402

CORS_ALLOW_HEADERS = list(default_headers) + ['x-tenant', 'x-order-token']

# Django 3.2 format: host names, e.g. ".restroscans.com,admin.restroscans.com"
CSRF_TRUSTED_ORIGINS = env_list('CSRF_TRUSTED_ORIGINS')

_https = HTTP_METHOD.startswith('https')
SESSION_COOKIE_SECURE = env_bool('SECURE_COOKIES', _https)
CSRF_COOKIE_SECURE = SESSION_COOKIE_SECURE
SECURE_SSL_REDIRECT = env_bool('SECURE_SSL_REDIRECT', False)
if env_bool('USE_X_FORWARDED_PROTO', _https):
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# --- Internationalisation -----------------------------------------------------

LANGUAGE_CODE = 'en-us'
TIME_ZONE = env('TIME_ZONE', 'Asia/Kolkata')
USE_I18N = True
USE_TZ = True

DATE_FORMAT = 'd/m/Y'
DATE_INPUT_FORMATS = ('%d/%m/%Y',)
DATETIME_FORMAT = 'd/m/Y H:i'
DATETIME_INPUT_FORMATS = ('%d/%m/%Y %H:%M',)

# --- Static and media files ---------------------------------------------------

STATIC_URL = env('STATIC_URL', '/staticfiles/')
STATIC_ROOT = env('STATIC_ROOT', str(BASE_DIR / 'admin_app' / 'static'))
MEDIA_URL = env('MEDIA_URL', 'media/')
MEDIA_ROOT = env('MEDIA_ROOT', str(BASE_DIR / 'media'))
# Keep Django serving /media/ unless the web server (nginx) is configured to do it.
SERVE_MEDIA_FILES = env_bool('SERVE_MEDIA_FILES', True)
FILE_UPLOAD_HANDLERS = ['django.core.files.uploadhandler.TemporaryFileUploadHandler']

# --- Email --------------------------------------------------------------------

EMAIL_HOST = env('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = env_int('EMAIL_PORT', 587)
EMAIL_USE_TLS = env_bool('EMAIL_USE_TLS', True)
EMAIL_USE_SSL = env_bool('EMAIL_USE_SSL', False)
EMAIL_HOST_USER = env('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD', '')
EMAIL_TIMEOUT = env_int('EMAIL_TIMEOUT', 15)
EMAIL_BACKEND = env(
    'EMAIL_BACKEND',
    'django.core.mail.backends.smtp.EmailBackend'
    if EMAIL_HOST_USER
    else 'django.core.mail.backends.console.EmailBackend',
)
DEFAULT_FROM_EMAIL = env('DEFAULT_FROM_EMAIL', EMAIL_HOST_USER or 'no-reply@' + BASE_DOMAIN)

# --- OTP / SMS ----------------------------------------------------------------

SMS_PROVIDER = env('SMS_PROVIDER', 'console')
SMS_API_URL = env('SMS_API_URL', '')
SMS_API_KEY = env('SMS_API_KEY', '')
OTP_LENGTH = env_int('OTP_LENGTH', 6)
OTP_EXPIRY_MINUTES = env_int('OTP_EXPIRY_MINUTES', 5)
OTP_MAX_SENDS = env_int('OTP_MAX_SENDS', 5)
OTP_MAX_ATTEMPTS = env_int('OTP_MAX_ATTEMPTS', 5)
OTP_RESEND_SECONDS = env_int('OTP_RESEND_SECONDS', 30)
# How long a verified phone may place orders, and how much longer it may still view/update its own order.
OTP_TOKEN_MINUTES = env_int('OTP_TOKEN_MINUTES', 20)
ORDER_ACCESS_GRACE_HOURS = env_int('ORDER_ACCESS_GRACE_HOURS', 12)
ORDER_ACCESS_ENFORCED = env_bool('ORDER_ACCESS_ENFORCED', True)
# How long a WebSocket ticket (see tenant_app/services/ws_ticket.py) can be used to connect.
WS_TICKET_SECONDS = env_int('WS_TICKET_SECONDS', 60)

# --- Push notifications (Firebase) --------------------------------------------

FCM_DJANGO_SETTINGS = {'FCM_SERVER_KEY': env('FCM_SERVER_KEY', '')}
FIREBASE_CREDENTIALS_FILE = env('FIREBASE_CREDENTIALS_FILE', str(BASE_DIR / 'backend' / 'credentials.json'))
# Project that signs the customer phone-auth ID token. Independent of the FCM service account.
FIREBASE_PROJECT_ID = env('FIREBASE_PROJECT_ID', '')

# --- Real-time (Channels) -----------------------------------------------------

REDIS_URL = env('REDIS_URL', '')
try:
    import channels  # noqa: F401

    INSTALLED_APPS.append('channels')
    if REDIS_URL:
        CHANNEL_LAYERS = {
            'default': {
                'BACKEND': 'channels_redis.core.RedisChannelLayer',
                'CONFIG': {'hosts': [REDIS_URL]},
            }
        }
    else:
        CHANNEL_LAYERS = {'default': {'BACKEND': 'channels.layers.InMemoryChannelLayer'}}
except ImportError:
    pass

# --- Logging ------------------------------------------------------------------

LOG_DIR = Path(env('LOG_DIR', str(BASE_DIR / 'logs')))
LOG_DIR.mkdir(parents=True, exist_ok=True)
LOG_LEVEL = env('LOG_LEVEL', 'DEBUG' if DEBUG else 'INFO')

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'simple': {'format': '{levelname} {asctime} {module} {lineno:d} {message}', 'style': '{'},
    },
    'handlers': {
        'console': {'class': 'logging.StreamHandler', 'formatter': 'simple'},
        'django_file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': str(LOG_DIR / 'django_logs.log'),
            'maxBytes': 1024 * 1024,
            'backupCount': 3,
            'formatter': 'simple',
        },
        'app_file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': str(LOG_DIR / 'custom_logs.log'),
            'maxBytes': 1024 * 1024,
            'backupCount': 3,
            'formatter': 'simple',
        },
    },
    'loggers': {
        'django': {'handlers': ['django_file'], 'level': 'INFO', 'propagate': False},
        'custom_logger': {
            'handlers': ['app_file', 'console'] if DEBUG else ['app_file'],
            'level': LOG_LEVEL,
            'propagate': False,
        },
    },
}

# --- Firebase initialisation (after logging so failures are recorded) ---------

if FIREBASE_CREDENTIALS_FILE and os.path.exists(FIREBASE_CREDENTIALS_FILE):
    try:
        from firebase_admin import credentials, initialize_app

        initialize_app(credentials.Certificate(FIREBASE_CREDENTIALS_FILE))
    except ValueError:
        pass  # already initialised (autoreload)
    except Exception:
        logging.getLogger('custom_logger').exception('Firebase could not be initialised')
