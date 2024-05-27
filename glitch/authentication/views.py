from django.http import JsonResponse, HttpResponseBadRequest
from django.contrib.auth import login as auth_login, authenticate
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenRefreshView

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
            if request.user.is_staff == 1:
                return JsonResponse({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'teacher': 'True',
                    'message':  'Login successful'
                })

            if request.user.is_staff == 0:
                return JsonResponse({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'teacher': 'False',
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
