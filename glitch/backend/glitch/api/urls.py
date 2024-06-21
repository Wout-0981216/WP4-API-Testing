from rest_framework.routers import DefaultRouter
from django.urls import path, include

router = DefaultRouter()  # Let op de haakjes hier om een instantie van DefaultRouter te maken

urlpatterns = [
    path('', include(router.urls))
]
