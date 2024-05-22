from django.contrib import admin
from django.urls import path
from game.views import concept_opdracht_list
from game.views import HomeCourses

urlpatterns = [
    path('api/concept-opdrachten/', concept_opdracht_list, name='concept-opdracht-list'),
    path('HomeCourses', HomeCourses, name='HomeCourses'),
]