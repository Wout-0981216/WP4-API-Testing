from django.urls import path
from authentication.views import register_user
from authentication.views import get_csrf_token
from rest_framework.routers import DefaultRouter
from .views import login, ValidateTokenView, HomeView, LogoutView, CustomTokenRefreshView

post_router = DefaultRouter()

urlpatterns = [
    path('login/', login, name='login'),
    path('home/', HomeView.as_view(), name='home'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('validate-token/', ValidateTokenView.as_view(), name='validate-token'),
    path('refresh-token/', CustomTokenRefreshView.as_view(), name='refresh-token'),
    path('api/register/', register_user, name='register_user_view'),
    path('api/csrf/', get_csrf_token, name='get_crsf')
]

urlpatterns += post_router.urls
