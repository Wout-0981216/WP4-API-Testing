from django.http import JsonResponse
from game.models import ConceptOpdracht, Activiteiten, User, Cursussen
from . import models
from rest_framework.decorators import api_view, permission_classes
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from django.middleware.csrf import get_token
from .models import User, Cursussen, Modules, HoofdOpdrachten, PuntenUitdagingen, ConceptOpdracht, Activiteiten, IngschrCursus
from django.views.decorators.csrf import csrf_exempt

@api_view(['GET'])
def concept_opdracht_list(request):
    if request.method == 'GET':
        opdrachten = ConceptOpdracht.objects.all()
        opdrachten_list = [
            {
                'id': opdracht.id,
                'naam': opdracht.naam,
                'beschrijving': opdracht.beschrijving
            } for opdracht in opdrachten
        ]
        print(opdrachten_list)
        return JsonResponse(opdrachten_list, safe=False)
    

@api_view(['GET'])
def activities_module(request):
    if request.method == 'GET':
        activities_module = Activiteiten.objects.all()
        activities_list = [
            {
                'id': activities.id,
                'naam': activities.naam,
                'beschrijving': activities.beschrijving
            } for activities in activities_module
        ]
        return JsonResponse(activities_list, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def HomepageStudent(request):
    if request.method == 'GET':
        # for the courses
        user_id = request.user.id
        user_name = request.user.username
        ingschr_cursussen = IngschrCursus.objects.filter(student_id=user_id)
        courses_data = []

        for ingschr_cursus in ingschr_cursussen:
            course = ingschr_cursus.cursus
            course_data = {
                'naam': course.naam,
                'beschrijving': course.beschrijving,
                'course_id': course.id,
                'voortgang': ingschr_cursus.voortgang
            }
            print(ingschr_cursus.voortgang)
            courses_data.append(course_data)

        if courses_data:
            return JsonResponse({'courses': courses_data, 'name': user_name, 'message': 'Cursussen gevonden'})
        else:
            return JsonResponse({'name': user_name, 'message': 'Geen cursussen gevonden voor deze gebruiker'})

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    if request.method == 'GET':
        print(request.user.id)
        user = User.objects.get(id=request.user.id)
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
            user = User.objects.get(id=request.user.id)
            user.first_name = request.data.get('first_name', '')
            user.last_name = request.data.get('last_name', '')
            user.username = request.data.get('username', '')
            user.email = request.data.get('email', '')
            user.password = request.data.get('password', '')
            user.save()
            return JsonResponse({'message': 'Profiel succesvol aangepast'}, status=200)

        except Exception as e:
            return JsonResponse({'message': f'error {e}'}, status=400)



def get_modules(request, course_id):
    if request.method == 'GET':
        course = Cursussen.objects.get(id=course_id)
        modules = Modules.objects.filter(cursus_id=course_id)
        module_list = {}
        j = 0
        for module in modules:
            j+=1
            modulenr = "module"+str(j)
            module_list[modulenr] = {"module_name" : module.naam}
            activity = Activiteiten.objects.filter(module_id=module.id)
            i = 1
            module_list[modulenr]["activities"] = {}

            for activity in activity:
                module_list[modulenr]["activities"]["activity"+str(i)] = activity.naam
                module_list[modulenr]["nr_of_activities"] = i
                i+=1
            points_challenge = PuntenUitdagingen.objects.get(module_id=module.id)
            module_list[modulenr]["points_challenge_points"] = points_challenge.benodige_punten
            context_challenge = ConceptOpdracht.objects.get(module_id=module.id)
            module_list[modulenr]["context_challenge_name"] = context_challenge.naam
            core_assignment = HoofdOpdrachten.objects.get(module_id=module.id)
            module_list[modulenr]["core_assignment_name"] = core_assignment.naam

        print(module_list)
        return JsonResponse({
                                "course_name" : course.naam,
                                "nr_of_modules" : j,
                                "module_list" : module_list
                            }, status=200, safe=False)

def get_csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrfToken': csrf_token})
