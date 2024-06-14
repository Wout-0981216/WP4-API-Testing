from django.contrib import admin
from django.urls import path
from game.views import concept_opdracht_list, activities_module, concept_opdracht_list, activities_module, HomepageStudent, get_modules, get_module, user_profile, get_csrf_token, get_domains, core_assignment_list, sign_off_niveau, submit_text

urlpatterns = [
    path('api/concept-opdracht/<int:concept_id>/', concept_opdracht_list, name='concept-opdracht-list'),
    path('api/activity/<int:activity_id>/', activities_module, name='activities_module'),
    path('HomeCourses', HomepageStudent, name='HomeCourses'),
    path('api/profile/', user_profile, name='user_profile_view'),
    path('api/domains/', get_domains, name='get_domains'),
    path('api/modules/<int:course_id>/', get_modules, name='get_modules'),
    path('api/module/<uuid:module_id>/', get_module, name='get_module'),
    path('api/post_niveau_progress/<int:niveau_id>/', sign_off_niveau, name='post_niveau_progress'),
    path('api/csrf/', get_csrf_token, name='get_csrf'),
    path('api/get_core_assignment/<int:core_id>/', core_assignment_list, name='core-assignment-list'),
    path('api/submit_text/', submit_text, name='submit_text'),
]
