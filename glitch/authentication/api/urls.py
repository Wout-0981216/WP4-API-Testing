from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import login

post_router = DefaultRouter()

urlpatterns = [
    path('login/', login, name='login'), 
]

urlpatterns += post_router.urls
