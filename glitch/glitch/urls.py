from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('teachers/', include('teachers.urls')),
    path('game/', include('game.urls')),
    path('login/', include('authentication.urls')),
    path('admin/', admin.site.urls),
]
