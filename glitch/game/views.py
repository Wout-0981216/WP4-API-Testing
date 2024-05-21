from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import get_token
from django.db import connection
from .models import User, Cursussen, Modules, HoofdOpdrachten, PuntenUitdagingen, ConceptOpdracht, Activiteiten
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import json

# Create your views here.

@api_view(['GET', 'POST'])
def user_profile(request):
    if request.method == 'GET':
        user = User.objects.get(id=1)
        date = str(user.date_joined).split(" ")[0]
        return JsonResponse({'first_name' : user.first_name,
                                'last_name' : user.last_name,
                                'username' : user.username,
                                'email' : user.email,
                                'password' : user.password,
                                'date_joined' : date,
                                'message' : 'Profiel info opgehaald'
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


def get_modules(request):
    if request.method == 'GET':
        course = Cursussen.objects.get(id=0)
        modules = Modules.objects.filter(cursus_id=0)
        module_list = {"course_name" : course.naam}
        j = 1
        for module in modules:
            modulenr = "module"+str(j)
            i = 1
            module_list[modulenr] = {"module_name" : module.naam}
            activity = Activiteiten.objects.filter(module_id=module.id)
            for activity in activity:
                module_list[modulenr]["activity"+str(i)] = activity.naam
                i+=1
            points_challenge = PuntenUitdagingen.objects.get(module_id=module.id)
            module_list[modulenr]["points_challenge_points"] = points_challenge.benodige_punten
            context_challenge = ConceptOpdracht.objects.get(module_id=module.id)
            module_list[modulenr]["context_challenge_name"] = context_challenge.naam
            core_assignment = HoofdOpdrachten.objects.get(module_id=module.id)
            module_list[modulenr]["core_assignment_name"] = core_assignment.naam
            j+=1

        print(module_list)
        return JsonResponse({
                                "module_list" : module_list
                            }, status=200, safe=False)

def get_csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrfToken': csrf_token})
