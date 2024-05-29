from django.contrib import admin
from django.urls import path
from game.views import concept_opdracht_list, activities_module, HomeCourses

urlpatterns = [
    path('api/concept-opdrachten/', concept_opdracht_list, name='concept-opdracht-list'),
    path('api/activiteiten/', activities_module, name='activities_module'),
    path('HomeCourses', HomeCourses, name='HomeCourses'),
]