from django.db import models
from django.contrib.auth.models import User
from django.http import JsonResponse
from .models import User

def register_user(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')

        user = User.objects.create_user(username=username, email=email, password=password)

        return JsonResponse({'message': 'Gebruiker geregistreerd succesvol'})
    else:
        return JsonResponse({'error': 'Alleen POST-verzoeken zijn toegestaan'})

