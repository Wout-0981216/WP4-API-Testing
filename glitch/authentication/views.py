from django.shortcuts import render
from django.http import JsonResponse



def register_user(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')

        return JsonResponse({'message': 'Gebruiker geregistreerd succesvol'})
    else:
        return JsonResponse({'error': 'Alleen POST-verzoeken zijn toegestaan'})
