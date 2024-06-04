
from django.http import JsonResponse
from game.models import ConceptOpdracht, Activiteiten, User, Cursussen
from . import models
from rest_framework.decorators import api_view, permission_classes
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from django.middleware.csrf import get_token
from .models import User, Cursussen, Modules, HoofdOpdrachten, PuntenUitdagingen, ConceptOpdracht, Activiteiten, IngschrCursus, VoortgangPuntenUitdaging
from django.views.decorators.csrf import csrf_exempt

@api_view(['GET'])
def concept_opdracht_list(request, module_id):
    opdrachten = ConceptOpdracht.objects.filter(module_id=module_id)
    opdrachten_list = [
        {
            'id': opdracht.id,
            'naam': opdracht.naam,
            'beschrijving': opdracht.beschrijving
        } for opdracht in opdrachten
    ]
    return JsonResponse(opdrachten_list, safe=False)
    

@api_view(['GET'])
def activities_module(request, module_id):
        activities_module = Activiteiten.objects.filter(module_id=module_id)
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
        teacher = request.user.is_teacher
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
            courses_data.append(course_data)

        if teacher:
            return JsonResponse({'teacher': "true"})
        if courses_data:
            return JsonResponse({'courses': courses_data, 'name': user_name, 'message': 'Cursussen gevonden'})
        else:
            return JsonResponse({'name': user_name, 'message': 'Geen cursussen gevonden voor deze gebruiker'})


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    if request.method == 'GET':
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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
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
            module_list[modulenr]["module_id"] = module.id
            activities = Activiteiten.objects.filter(module_id=module.id)
            i = 1
            module_list[modulenr]["activities"] = {}

            for activity in activities:
                module_list[modulenr]["activities"]["activity"+str(i)] = activity.naam
                module_list[modulenr]["nr_of_activities"] = i
                i+=1
            points_challenge = PuntenUitdagingen.objects.get(module_id=module.id)
            user_progress = VoortgangPuntenUitdaging.objects.get(punten_uitdaging_id=points_challenge.id, student_id=request.user.id)
            module_list[modulenr]["points_challenge"] = {"points_challenge_points": points_challenge.benodige_punten, "points_challenge_progress": user_progress.voortgang}
            context_challenge = ConceptOpdracht.objects.get(module_id=module.id)
            module_list[modulenr]["context_challenge_name"] = context_challenge.naam
            core_assignment = HoofdOpdrachten.objects.get(module_id=module.id)
            module_list[modulenr]["core_assignment_name"] = core_assignment.naam

        return JsonResponse({
                                "course_name" : course.naam,
                                "nr_of_modules" : j,
                                "module_list" : module_list
                            }, status=200, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_module(request, module_id):
    if request.method == 'GET':
        module = Modules.objects.get(id=module_id)
        module_info = {"module_name": module.naam, "module_id": module.id, "module_desc": module.beschrijving}
        i = 1
        module_activities = {}
        activities = Activiteiten.objects.filter(module_id=module.id)
        for activity in activities:
            module_activities["activity"+str(i)] = {"activity_name": activity.naam, "activity_desc": activity.beschrijving, "activity_id": activity.id}
            module_info["nr_of_activities"] = i
            i+=1
        points_challenge = PuntenUitdagingen.objects.get(module_id=module.id)
        user_progress = VoortgangPuntenUitdaging.objects.get(punten_uitdaging=points_challenge.id, student=request.user.id)
        points_challenge_info = {"points_challenge_points": points_challenge.benodige_punten, "points_challenge_progress": user_progress.voortgang}
        context_challenge = ConceptOpdracht.objects.get(module_id=module.id)
        context_challenge_info = {"challenge_name": context_challenge.naam, "challenge_desc": context_challenge.beschrijving, "challenge_id": context_challenge.id}
        core_assignment = HoofdOpdrachten.objects.get(module_id=module.id)
        core_assignment_info = {"challenge_name": core_assignment.naam, "challenge_desc": core_assignment.beschrijving, "challenge_id": core_assignment.id}

        return JsonResponse({
                                "module_name" : module.naam,
                                "module_info" : module_info,
                                "activities" : module_activities,
                                "points_challenge" : points_challenge_info,
                                "context_challenge" : context_challenge_info,
                                "core_assignment" : core_assignment_info
                            }, status=200, safe=False)

def get_csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrfToken': csrf_token})
