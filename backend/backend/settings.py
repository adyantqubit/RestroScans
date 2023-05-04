from pathlib import Path

import django
from django.utils.encoding import force_str
from firebase_admin import initialize_app
from firebase_admin import credentials
django.utils.encoding.force_text = force_str

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-+#hjip+*eco$k9w%aenskxn6t2vwyrxtriyj+!1b78qgys$=mw'

DEBUG = True

ALLOWED_HOSTS = ['*']

"""---------------------------------------------------------------------------------------
Commented and modified by - Ashish Dewangan on 08-02-2023
Reason - To have different app configuration for multitenancy system
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]
"""
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
    "corsheaders",
    # Added by Yuvraj Sahu on 27-3-2023
    # Reason - to setup admin template 
    'admin_volt.apps.AdminVoltConfig',
    # End of addition

    'ckeditor',
    
    
    # Added by - Ashish Dewangan on 28-04-2023
    # Reason - To have fcm functionality
    "fcm_django",
    # End of code addition by Ashish Dewangan on 28-04-2023
]

"""
End of code modification
"""

"""---------------------------------------------------------------------------------------
Added by - Ashish Dewangan on 08-02-2023
Reason - Added to define public schema and url config
"""
PUBLIC_SCHEMA_NAME='public'
PUBLIC_SCHEMA_URLCONF='backend.urls'
"""
End of code addition
"""
ROOT_URLCONF = 'backend.urls'

"""---------------------------------------------------------------------------------------
Added by - Ashish Dewangan on 08-02-2023
Reason - To have Tenant file system storage as default file storage. Required by django-tenant-schemas.
"""
DEFAULT_FILE_STORAGE = 'tenant_schemas.storage.TenantFileSystemStorage'
"""
End of code addition
"""

"""---------------------------------------------------------------------------------------
Added by - Ashish Dewanga on 08-02-2023
Reason - To specify tenant model where clients will be located.
"""
TENANT_MODEL = "admin_app.Tenant" 
"""
End of code addition
"""

"""---------------------------------------------------------------------------------------
Commented and modified by - Ashish Dewangan on 08-02-2023
Reason - To configure custom middleware. This middleware will specify which tenant to use on runtime
"""
# MIDDLEWARE = [
#     'django.middleware.security.SecurityMiddleware',
#     'django.contrib.sessions.middleware.SessionMiddleware',
#     'django.middleware.common.CommonMiddleware',
#     'django.middleware.csrf.CsrfViewMiddleware',
#     'django.contrib.auth.middleware.AuthenticationMiddleware',
#     'django.contrib.messages.middleware.MessageMiddleware',
#     'django.middleware.clickjacking.XFrameOptionsMiddleware',
# ]

MIDDLEWARE = [
    # 'tenant_schemas.middleware.TenantMiddleware',
    'admin_app.middlewares.MutitenantMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
]
"""
End of code modification
"""

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        # Commented & Modified by Yuvraj Sahu 
        # Date : 27-3-23
        # Reason : To Create a custom templates
        # 'DIRS': [],
        'DIRS': ['backend/templates',],
        # End of the modification
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

"""---------------------------------------------------------------------------------------
Added by - Ashish Dewangan on 08-02-2023
Reason - Required by django-tenant-schema
"""
TEMPLATE_CONTEXT_PROCESSORS = (
    'django.core.context_processors.request',
)
"""
End of code addition
"""

WSGI_APPLICATION = 'backend.wsgi.application'


"""---------------------------------------------------------------------------------------
Commented and modified by - Ashish Dewangan on 08-02-2023
Reason - To specify database related settings
"""
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }
DATABASES = {
    'default': {
        'ENGINE': 'tenant_schemas.postgresql_backend',
        'NAME': 'restroscanner',
        'USER':'postgres',
        'PASSWORD':'postgres123',
        'HOST':'localhost',
        'PORT':'5432',
    }
}
"""
End of code modification
"""

"""---------------------------------------------------------------------------------------
Added by - Ashish Dewangan on 08-02-2023
Reason - Required by django-tenant-schema. It routes the request to tenant specific schema.
"""
DATABASE_ROUTERS = (
    'tenant_schemas.routers.TenantSyncRouter',
)
"""
End of code addition
"""

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


LANGUAGE_CODE = 'en-us'

# Commented and modified by - Ashish Dewangan on 03-05-2023
# Reason - To change time zone according to India.
# TIME_ZONE = 'UTC'
TIME_ZONE = 'Asia/Kolkata'
# End of code modification by Ashish Dewangan on 03-05-2023

USE_I18N = True

USE_TZ = True

STATIC_URL = 'static/'
STATIC_URL = '/staticfiles/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Added by Om on 04-05-23
# Reason : set the GTK path in runtime
import os
GTK_FOLDER = r'C:\Program Files\GTK3-Runtime Win64\bin'
os.environ['PATH'] = GTK_FOLDER + os.pathsep + os.environ.get('PATH', '')
# End of addition

# Modified by Yuvraj Sahu on 27-3-2023
# Reason - to set static files path
STATIC_ROOT = os.path.join(BASE_DIR, 'admin_app/static')
# End of addition
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

MEDIA_URL='media/'


"""
Added by Yuvraj Sahu on 17-2-2023
Reason - to set up cors policies
"""
CORS_ORIGIN_ALLOW_ALL=True
CORS_ALLOW_CREDENTIALS= True


"""
Added by Yuvraj Sahu on 18-2-2023
Reason - to send mail
"""
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'    
EMAIL_HOST= 'smtp.gmail.com'
EMAIL_USE_TLS = True
EMAIL_PORT = 587

EMAIL_HOST_USER = 'om2019sri@gmail.com'
EMAIL_HOST_PASSWORD = 'srhfjpvlcqylvssj'
"""
End of code addition
"""

"""
Added by Yuvraj Sahu on 28-3-2023
Reason - to set http method
"""
HTTP_METHOD = "http://"
"""
End of code addition
"""

"""
Added by Yuvraj Sahu on 28-3-2023
Reason - to set domain
"""
DOMAIN_NAME = "restroscans"
FRONTEND_URL = "restroscans.com/"
BACKEND_URL = "restroscans.com/"
API_VERSION = "v1/"
"""
End of code addition
"""
FILE_UPLOAD_HANDLERS = [
    'django.core.files.uploadhandler.TemporaryFileUploadHandler',
]


# Added by - Ashish Dewangan on 28-04-2023
# Reason - To have firebase push notification functionality
FCM_DJANGO_SETTINGS = {
    "FCM_SERVER_KEY":"AAAAgOsiroc:APA91bE1B1_2U5YThv_olkTP_b8zvbgLq8dOfjHnkf1Qh9UjKk7DTmMVkYeIaGcCm57AEMIRBPYZGHZgA_CMRyDXSlnHR7mhyVKz-Qn3diaUJNE41CVx7cVFIk7tF1aC1KxswhU0lhCz",
}
cred = credentials.Certificate(os.path.join(BASE_DIR, 'backend/credentials.json'))
initialize_app(cred)
# End of code addition by Ashish Dewangan on 28-04-2023
