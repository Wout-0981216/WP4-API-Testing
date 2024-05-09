from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import get_token
from django.db import connection
from .models import GameUser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

@api_view(['POST'])
def register_user(request):
      if request.method == 'POST':
           # getting data from request
           first_name = request.data.get('first_name', '')
           last_name = request.data.get('last_name', '')
           username = request.data.get('username', '')
           email = request.data.get('email', '')
           password = request.data.get('password', '')
            
           if not (first_name and last_name and username and email and password):
               return JsonResponse({'error': 'Missing required fields'}, status=400)
           is_superuser = 0
           is_staff = 0
           is_active = 1
           is_teacher = GameUser().is_teacher

           sql = """ INSERT INTO game_user (is_active, is_staff, is_superuser, first_name, last_name, email, username, password, date_joined, is_teacher)
           VALUES (%s,%s,%s,%s, %s, %s, %s, %s, CURRENT_TIMESTAMP, %s)"""

           try:
               with connection.cursor() as cursor:
                    cursor.execute(sql, [is_active, is_staff, is_superuser, first_name, last_name, email, username, password, is_teacher])

               return JsonResponse({'message': 'Succesvol geregistreerd'}, status=200)
           except Exception as e:  
            
               return JsonResponse({'error': 'Only POST requests are allowed'}, status=500)


def get_csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrf_token': csrf_token})