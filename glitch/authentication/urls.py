from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import login, ValidateTokenView, HomeView, LogoutView

post_router = DefaultRouter()

urlpatterns = [
    path('login/', login, name='login'),
    path('home/', HomeView.as_view(), name='home'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('validate-token/', ValidateTokenView.as_view(), name='validate-token'),
]

urlpatterns += post_router.urls
