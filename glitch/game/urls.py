from django.contrib import admin
from django.urls import path
from .views import concept_opdracht_list, activities_module, HomeCourses, get_modules, get_module, user_profile, get_csrf_token

urlpatterns = [
    path('api/concept-opdrachten/', concept_opdracht_list, name='concept-opdracht-list'),
    path('api/activiteiten/', activities_module, name='activities_module'),
    path('HomeCourses', HomeCourses, name='HomeCourses'),
    path('api/profile/', user_profile, name='user_profile_view'),
    path('api/modules/<int:course_id>/', get_modules, name='get_modules'),
    path('api/module/<int:module_id>/', get_module, name='get_module'),
    path('api/csrf/', get_csrf_token, name='get_csrf'),
]
