from django.contrib import admin
from django.urls import path
from .views import concept_opdracht_list

urlpatterns = [
    path('api/concept-opdrachten/', concept_opdracht_list, name='concept-opdracht-list'),
]
