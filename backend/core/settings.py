import os
from datetime import timedelta
from pathlib import Path

# --------------------------------------------------------
# BASE DIRECTORY
# --------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent


# --------------------------------------------------------
# SECURITY SETTINGS
# --------------------------------------------------------
SECRET_KEY = 'django-insecure-your-secret-key-here'  # 🔒 change this in production!
DEBUG = True

ALLOWED_HOSTS = ['*']  # For development, allow all. Change to your domain or IP in production.


# --------------------------------------------------------
# APPLICATION DEFINITION
# --------------------------------------------------------
INSTALLED_APPS = [
    # Default Django apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party apps
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist', 
    'corsheaders',
    'django_filters',

    # Project apps
    'apps.accounts',
    'apps.announcements',
    'apps.hymns',
    'apps.livestream',
    'apps.sms',
    'apps.members',
    'apps.finance',
    'apps.events',
]


MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CORS_ALLOW_ALL_ORIGINS = True


ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],  # Optional for admin or HTML pages
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

WSGI_APPLICATION = 'core.wsgi.application'


# --------------------------------------------------------
# DATABASE CONFIGURATION
# --------------------------------------------------------
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# For production, you can switch to PostgreSQL:
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': 'church_db',
#         'USER': 'youruser',
#         'PASSWORD': 'yourpassword',
#         'HOST': 'localhost',
#         'PORT': '5432',
#     }
# }


# --------------------------------------------------------
# PASSWORD VALIDATION
# --------------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


# --------------------------------------------------------
# INTERNATIONALIZATION
# --------------------------------------------------------
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Africa/Nairobi'
USE_I18N = True
USE_TZ = True


# --------------------------------------------------------
# STATIC & MEDIA FILES
# --------------------------------------------------------
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [BASE_DIR / 'static']

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'


# --------------------------------------------------------
# CUSTOM USER MODEL
# --------------------------------------------------------
AUTH_USER_MODEL = 'accounts.User'


# --------------------------------------------------------
# REST FRAMEWORK SETTINGS
# --------------------------------------------------------
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',  # Allow all for now, restrict in production
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,  # Default pagination size
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ],
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
}



# --------------------------------------------------------
# SIMPLE JWT SETTINGS
# --------------------------------------------------------
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
}


# --------------------------------------------------------
# CORS SETTINGS (for frontend + mobile app)
# --------------------------------------------------------
CORS_ALLOW_ALL_ORIGINS = True  # During dev; restrict in production
CORS_ALLOW_CREDENTIALS = True


# --------------------------------------------------------
# DEFAULT AUTO FIELD
# --------------------------------------------------------
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
