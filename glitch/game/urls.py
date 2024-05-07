from django.contrib import admin
from django.urls import path
from game.views import user_profile
from game.views import get_csrf_token

urlpatterns = [
  path('api/profile/', user_profile, name='user_profile_view'),
  path('api/csrf/', get_csrf_token, name='get_csrf'),
]
