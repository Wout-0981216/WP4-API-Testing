from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import get_token
from django.db import connection
from .models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

# Create your views here.

@api_view(['GET', 'POST'])
def user_profile(request):
    if request.method == 'GET':
        user = User.objects.get(id=1)
        return JsonResponse({'first_name' : user.first_name,
                                'last_name' : user.last_name,
                                'username' : user.username,
                                'email' : user.email,
                                'password' : user.password,
                                'date_joined' : user.date_joined,
                                }, status=200)

    if request.method == 'POST':
        try:
            user = User.objects.get(id=1)
            user.is_superuser = 0
            user.is_staff = 0
            user.is_active = 1
            user.first_name = request.data.get('first_name', '')
            user.last_name = request.data.get('last_name', '')
            user.username = request.data.get('username', '')
            user.email = request.data.get('email', '')
            user.password = request.data.get('password', '')
            user.save()
            return JsonResponse({'message': 'Profiel succesvol aangepast'}, status=200)
        
        except Exception as e:
            return JsonResponse({'message': 'error {e}'}, status=400)



def get_csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrfToken': csrf_token})
