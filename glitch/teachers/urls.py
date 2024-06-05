from django.contrib import admin
from django.urls import path
from . import views
from .views import course_list, student_list


urlpatterns = [
    path('register_module/', views.register_module, name="register_module"),
    path('api/courses/', course_list, name='course-list'),
    path('api/students/<int:course_id>/', student_list, name='student-list'),
]
