from django.http import JsonResponse
from django.contrib.auth import login as auth_login, authenticate
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponseBadRequest
from rest_framework.decorators import api_view

@csrf_exempt
@api_view(['POST'])
def login(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user:
            auth_login(request, user)
            return JsonResponse({'message': 'Login successful'})
        else:
            return HttpResponseBadRequest('Invalid credentials')
    else:
        return HttpResponseBadRequest('Invalid request method')
