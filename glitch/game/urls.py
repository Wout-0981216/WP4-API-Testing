from django.contrib import admin
from django.urls import path
from game.views import user_profile
from game.views import get_csrf_token
from game.views import get_modules

urlpatterns = [
  path('api/profile/', user_profile, name='user_profile_view'),
  path('api/module/<int:course_id>/', get_modules, name='get_modules'),
  path('api/csrf/', get_csrf_token, name='get_csrf'),
]
