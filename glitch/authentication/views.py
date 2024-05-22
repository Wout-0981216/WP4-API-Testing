from django.shortcuts import render
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import get_token
from django.db import connection
from .models import GameUser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import login as auth_login, authenticate
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenRefreshView

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

@csrf_exempt
@api_view(['POST'])
def login(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user:
            auth_login(request, user)
            refresh = RefreshToken.for_user(user)
            print("login succesvol")
            return JsonResponse({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'message': 'Login successful'
            })

        else:
            return HttpResponseBadRequest('Invalid credentials')
    else:
        return HttpResponseBadRequest('Invalid request method')

class HomeView(APIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request):
        content = {'message': 'Welcome to the JWT Authentication page using React Js and Django!'}
        return Response(content)

class ValidateTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'message': 'Token is valid'}, status=200)

class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = [JSONParser]

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            print("Error:", e)
            return Response(status=status.HTTP_400_BAD_REQUEST)


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.data.get("refresh_token")
            if not refresh_token:
                return Response({"detail": "Refresh token not provided"}, status=status.HTTP_400_BAD_REQUEST)
            token = RefreshToken(refresh_token)
            access_token = str(token.access_token)
            return JsonResponse({'access_token': access_token}, status=status.HTTP_200_OK)
        except Exception as e:
            print("Error:", e)
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
