from django.contrib import admin
from django.urls import path
from authentication.views import register_user
from authentication.views import get_csrf_token

urlpatterns = [
    path('api/register/', register_user, name='register_user_view'),
    path('api/csrf/', get_csrf_token, name='get_crsf'),
]
