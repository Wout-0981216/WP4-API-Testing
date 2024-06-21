from django.http import JsonResponse
from game.models import ConceptOpdracht, Activiteiten, User, Cursussen
from . import models
from rest_framework.decorators import api_view, permission_classes
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from django.middleware.csrf import get_token
from .models import User, Cursussen, Modules, HoofdOpdrachten, PuntenUitdagingen, ConceptOpdracht, Activiteiten, IngschrCursus, VoortgangPuntenUitdaging, Niveaus, VoortgangActiviteitenNiveaus, VoortgangConceptOpdrachten, VoortgangHoofdOpdrachten, Domeinen, IngschrDomein
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password
from django.views.decorators.csrf import csrf_exempt
import json
from .models import ConceptOpdracht
from django.contrib.auth.models import AnonymousUser

@api_view(['GET'])
def get_domains(request):
    domeinen = Domeinen.objects.all()
    domain_list = [{
        'label': domein.naam,
        'value': domein.id
    } for domein in domeinen]
    return JsonResponse({'domain_list':domain_list})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def concept_opdracht_list(request, concept_id):
    opdracht = ConceptOpdracht.objects.get(id=concept_id)
    voortgang = VoortgangConceptOpdrachten.objects.get(concept_opdracht_id=opdracht.id, student_id=request.user.id)
    opdrachten_list = [
        {
            'id': opdracht.id,
            'naam': opdracht.naam,
            'beschrijving': opdracht.beschrijving,
            'progress' : voortgang.voortgang,
            'handed_in_text': voortgang.ingeleverd_tekst
        }
    ]
    return JsonResponse({"assignment_info": opdrachten_list, "module_id": opdracht.module.id}, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def core_assignment_list(request, core_id):
    try:
        opdracht = HoofdOpdrachten.objects.get(id=core_id)
        voortgang = VoortgangHoofdOpdrachten.objects.get(hoofd_opdracht=opdracht, student=request.user)
        
        opdrachten_list = [
            {
                'id': opdracht.id,
                'naam': opdracht.naam,
                'beschrijving': opdracht.beschrijving,
                'progress' : voortgang.voortgang,
                'handed_in_text': voortgang.ingeleverd_tekst
            }
        ]
        response = {
            "assignment_info": opdrachten_list,
            "module_id": opdracht.module.id
        }
        return JsonResponse(response, safe=False)
    except HoofdOpdrachten.DoesNotExist:
        return JsonResponse({'error': 'HoofdOpdracht niet gevonden'}, status=404)
    except VoortgangHoofdOpdrachten.DoesNotExist:
        return JsonResponse({'error': 'VoortgangHoofdOpdrachten niet gevonden'}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def activities_module(request, activity_id):
    activity = Activiteiten.objects.get(id=activity_id)
    activity_info = [{
            'id': activity.id,
            'naam': activity.naam,
            'beschrijving': activity.beschrijving
        }]
    niveaus = Niveaus.objects.filter(activiteit_id=activity.id)
    niveau_info = [{
            "id" : niveau.id,
            "beschrijving" : niveau.beschrijving,
            "progress" : VoortgangActiviteitenNiveaus.objects.get(niveau_id=niveau.id, student_id=request.user.id).voortgang
            } for niveau in niveaus]

    return JsonResponse({"activity_info": activity_info,
                         "niveau_info": niveau_info,
                         "module_id": activity.module.id
                         }, safe=False)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sign_off_niveau(request, niveau_id):
    if request.method == 'POST':
        try:
            niveau_voortgang = VoortgangActiviteitenNiveaus.objects.get(niveau_id=niveau_id, student_id=request.user.id)
            if niveau_voortgang.voortgang == 0:
                niveau_voortgang.voortgang = 1
                niveau_voortgang.save()
                module = Modules.objects.get(id=(Activiteiten.objects.get(id=(Niveaus.objects.get(id=niveau_voortgang.niveau_id).activiteit_id)).module_id))
                points_challenge = PuntenUitdagingen.objects.get(module=module)
                points_challenge_progress = VoortgangPuntenUitdaging.objects.get(punten_uitdaging = points_challenge, student_id = request.user.id)
                if points_challenge_progress.voortgang < points_challenge.benodige_punten:
                    points_challenge_progress.voortgang +=1
                    points_challenge_progress.save()
            ingschr_cursussen = IngschrCursus.objects.filter(student=request.user.id)
            for cursus in ingschr_cursussen:
                voortgang = 0
                modules = Modules.objects.filter(cursus_id=cursus.cursus)
                for module in modules:
                    punten = VoortgangPuntenUitdaging.objects.get(student_id = request.user.id, punten_uitdaging=PuntenUitdagingen.objects.get(module=module)).voortgang
                    voortgang += punten
                cursus.voortgang=voortgang
                cursus.save()

            return JsonResponse({'message': 'Niveau afgerond'}, status=200)

        except Exception as e:
            return JsonResponse({'message': f'error {e}'}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def HomepageStudent(request):
    if request.method == 'GET':
        # for the courses
        user_id = request.user.id
        teacher = request.user.is_teacher
        user_name = request.user.first_name
        if teacher:
            teacher_domains_data = []
            domains = Domeinen.objects.all()
            for domain in domains:
                teacher_domain_data = {'naam': domain.naam, 'beschrijving': domain.beschrijving, 'id': domain.id, 'courses_data': []}
                courses = Cursussen.objects.filter(domein=domain)
                for course in courses:
                    teacher_course_data = {
                        'naam': course.naam,
                        'beschrijving': course.beschrijving,
                        'course_id': course.id
                    }
                    teacher_domain_data['courses_data'].append(teacher_course_data)
                teacher_domains_data.append(teacher_domain_data)

        else:
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
            return JsonResponse({'teacher': "true", 'domains': teacher_domains_data, 'name': user_name, 'message': 'Domeinen gevonden'})
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
            if request.data.get('password', '') != user.password:
                hashed_password = make_password(request.data.get('password', ''))
                user.password = hashed_password
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
            is_teacher = request.user.is_teacher

            #if requesting user is a teacher; don't retrieve progress, teachers don't have progress on assignments
            if is_teacher:
                for activity in activities:
                    module_list[modulenr]["nr_of_activities"] = i
                    module_list[modulenr]["activities"]["activity"+str(i)] = {"activity_name": activity.naam, }
                    i+=1
                points_challenge = PuntenUitdagingen.objects.get(module_id=module.id)
                module_list[modulenr]["points_challenge"] = {"points_challenge_points": points_challenge.benodige_punten}
                context_challenge = ConceptOpdracht.objects.get(module_id=module.id)
                module_list[modulenr]["context_challenge_name"] = context_challenge.naam
                core_assignment = HoofdOpdrachten.objects.get(module_id=module.id)
                module_list[modulenr]["core_assignment_name"] = core_assignment.naam

            #if user is a student: also retrieve progress
            else:
                for activity in activities:
                    module_list[modulenr]["nr_of_activities"] = i
                    niveaus = Niveaus.objects.filter(activiteit=activity)
                    progress_counter = 0
                    for niveau in niveaus:
                        niveau_voortgang = VoortgangActiviteitenNiveaus.objects.get(niveau=niveau, student=request.user.id)
                        if niveau_voortgang.voortgang == True:
                            progress_counter +=1
                    module_list[modulenr]["activities"]["activity"+str(i)] = {"activity_name": activity.naam, "progress": progress_counter, "max_progress": len(niveaus)}
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
            module_info["nr_of_activities"] = i
            niveaus = Niveaus.objects.filter(activiteit=activity)
            progress_counter = 0
            for niveau in niveaus:
                niveau_voortgang = VoortgangActiviteitenNiveaus.objects.get(niveau=niveau, student=request.user.id)
                if niveau_voortgang.voortgang == True:
                    progress_counter +=1
            module_activities["activity"+str(i)] = {"activity_name": activity.naam, "activity_desc": activity.beschrijving, "activity_id": activity.id, "progress": progress_counter, "max_progress": len(niveaus)}
            i+=1
        points_challenge = PuntenUitdagingen.objects.get(module_id=module.id)
        user_progress = VoortgangPuntenUitdaging.objects.get(punten_uitdaging=points_challenge.id, student=request.user.id)
        points_challenge_info = {"points_challenge_points": points_challenge.benodige_punten, "points_challenge_progress": user_progress.voortgang}
        context_challenge = ConceptOpdracht.objects.get(module_id=module.id)
        context_challenge_info = {"challenge_name": context_challenge.naam, "challenge_desc": context_challenge.beschrijving, "challenge_id": context_challenge.id}
        core_assignment = HoofdOpdrachten.objects.get(module_id=module.id)
        core_assignment_info = {"challenge_name": core_assignment.naam, "challenge_desc": core_assignment.beschrijving, "challenge_id": core_assignment.id}

        return JsonResponse({
                                "course_id": module.cursus.id,
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


@api_view(['POST'])
@csrf_exempt
@permission_classes([IsAuthenticated])
def submit_text(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        assignment_type = data.get('assignment_type')
        assignment_id = data.get('assignment_id')
        submitted_text = data.get('submitted_text')

        try:
            student = request.user

            if assignment_type == 'concept':
                concept_opdracht = ConceptOpdracht.objects.get(id=assignment_id)
                voortgang, created = VoortgangConceptOpdrachten.objects.get_or_create(
                    student=student,
                    concept_opdracht=concept_opdracht,
                    defaults={'voortgang': 0}
                )
                voortgang.ingeleverd_tekst = submitted_text
                voortgang.voortgang = 1
                voortgang.save()

            elif assignment_type == 'core':
                hoofd_opdracht = HoofdOpdrachten.objects.get(id=assignment_id)
                voortgang, created = VoortgangHoofdOpdrachten.objects.get_or_create(
                    student=student,
                    hoofd_opdracht=hoofd_opdracht,
                    defaults={'voortgang': 0}
                )
                voortgang.ingeleverd_tekst = submitted_text
                voortgang.voortgang = 1
                voortgang.save()

            else:
                return JsonResponse({'error': 'Ongeldig assignment_type'}, status=400)

            return JsonResponse({'message': 'Tekst succesvol ingeleverd'})

        except ConceptOpdracht.DoesNotExist:
            return JsonResponse({'error': 'ConceptOpdracht niet gevonden'}, status=404)
        except HoofdOpdrachten.DoesNotExist:
            return JsonResponse({'error': 'HoofdOpdracht niet gevonden'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Alleen POST-verzoeken zijn toegestaan voor deze endpoint'})
