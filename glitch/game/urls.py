from django.contrib import admin
from django.urls import path
from game.views import concept_opdracht_list, activities_module, concept_opdracht_list, activities_module, HomepageStudent, get_modules, get_module, user_profile, get_csrf_token

urlpatterns = [
    path('api/concept-opdracht/<int:concept_id>/', concept_opdracht_list, name='concept-opdracht-list'),
    path('api/activity/<int:activity_id>/', activities_module, name='activities_module'),
    path('HomeCourses', HomepageStudent, name='HomeCourses'),
    path('api/profile/', user_profile, name='user_profile_view'),
    path('api/modules/<int:course_id>/', get_modules, name='get_modules'),
    path('api/module/<uuid:module_id>/', get_module, name='get_module'),
    path('api/csrf/', get_csrf_token, name='get_csrf'),
]
