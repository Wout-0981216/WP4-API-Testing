from rest_framework.viewsets import ModelViewSet
from django.http import JsonResponse
from django.contrib.auth import login as auth_login, authenticate
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponseRedirect
from rest_framework.decorators import api_view
from rest_framework.response import Response

@csrf_exempt
@api_view(['POST'])
def login(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        print(request.user.username)
        if user:
            auth_login(request, user)
            return Response({'message': 'Login successful'}) 
        else:
            return HttpResponseRedirect('/api/login/')  
    else:
        return Response({'error': 'Invalid request method'}, status=400)