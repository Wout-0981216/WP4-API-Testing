from django.contrib import admin
from django.urls import path
from . import views
from .views import (
    course_list,
    student_list,
    get_student_voortgang,
    approve_assignment,
    reject_assignment,
    register_module,
    register_course,
    register_domain,
    get_student_module_info,
)

urlpatterns = [
    path('register_module/', register_module, name="register_module"),
    path('register_course/', register_course, name="register_course"),
    path('register_domain/', register_domain, name="register_domain"),
    path('api/courses/', course_list, name='course-list'),
    path('api/students/<int:course_id>/', student_list, name='student-list'),
    path('api/students_open/<int:student_id>/', get_student_voortgang, name='get_student_voortgang'),
    path('api/approve_assignment/', approve_assignment, name='approve_assignment'),
    path('api/reject_assignment/', reject_assignment, name='reject_assignment'),
    path('api/student_module_info/<int:student_id>/<int:course_id>/', get_student_module_info, name='get_student_module_info'),
]
