from django.db import models
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.utils import timezone

class GameUser(models.Model):
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=128)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_teacher = models.BooleanField(default=0)
    
    def __str__(self):
        return self.username
