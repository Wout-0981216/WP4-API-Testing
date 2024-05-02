from django.contrib import admin
from django.urls import path
from authentication.views import register_user

urlpatterns = [
    path('api/register/', register_user, name='register_user_view'),
]
