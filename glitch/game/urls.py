from django.contrib import admin
from django.urls import path
from .views import HomeCourses, get_modules, user_profile, get_csrf_token

urlpatterns = [
  path('HomeCourses', HomeCourses, name='HomeCourses'),
  path('api/profile/', user_profile, name='user_profile_view'),
  path('api/module/<int:course_id>/', get_modules, name='get_modules'),
  path('api/csrf/', get_csrf_token, name='get_csrf'),
]
