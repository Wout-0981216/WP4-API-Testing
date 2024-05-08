from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import login
from . import views

post_router = DefaultRouter()

urlpatterns = [
    path('', login, name='login'),
    path('home/', views.HomeView.as_view(), name ='home'),
    path('logout/', views.LogoutView.as_view(), name ='logout')
]

urlpatterns += post_router.urls
