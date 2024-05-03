from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import get_token
from .models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

@api_view(['POST'])
def register_user(request):
    if request.method == 'POST':
        username = request.data.get('username', '')
        email = request.data.get('email', '')
        password = request.data.get('password', '')

        # Maak het responsbericht
        message = f"Hallo {username}, jouw email is: {email} en wachtwoord is: {password}"

        # Stuur het responsbericht terug
        return Response({'message': message})

    # Stuur een fout als het verzoek geen POST is
    return Response({'error': 'Only POST requests are allowed'}, status=400)


def get_csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrfToken': csrf_token})