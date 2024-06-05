from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('register_module/', views.register_module, name="register_module"),
]
