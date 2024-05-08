from django.http import JsonResponse
from django.contrib.auth import login as auth_login, authenticate
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponseBadRequest
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status 
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.parsers import JSONParser


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


class HomeView(APIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request):
        content = {'message': 'Welcome to the JWT Authentication page using React Js and Django!'}
        return Response(content)


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
