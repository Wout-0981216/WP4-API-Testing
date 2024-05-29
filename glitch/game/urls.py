from django.contrib import admin
from django.urls import path
from game.views import concept_opdracht_list, activities_module, HomepageStudent, get_modules, user_profile, get_csrf_token

urlpatterns = [
    path('api/concept-opdrachten/', concept_opdracht_list, name='concept-opdracht-list'),
    path('api/activiteiten/', activities_module, name='activities_module'),
    path('HomeCourses', HomepageStudent, name='HomeCourses'),
    path('api/profile/', user_profile, name='user_profile_view'),
    path('api/module/<int:course_id>/', get_modules, name='get_modules'),
    path('api/csrf/', get_csrf_token, name='get_csrf'),
]
