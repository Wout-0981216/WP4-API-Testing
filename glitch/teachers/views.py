from django.http import JsonResponse
from rest_framework.decorators import api_view
from game.models import *
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from add_user_to_module import add_user_to_module

@csrf_exempt
@api_view(['POST'])
def register_module(request):
    if request.method == 'POST':
        module_name = request.data.get('module_name', '')
        module_des = request.data.get('module_des', '')
        main_assignment_title = request.data.get('main_assignment_title', '')
        main_assignment_des = request.data.get('main_assignment_des', '')
        activity1_title = request.data.get('activity1_title', '')
        activity2_title = request.data.get('activity2_title', '')
        activity3_title = request.data.get('activity3_title', '')
        activity1_des = request.data.get('activity1_des', '')
        activity2_des = request.data.get('activity2_des', '')
        activity3_des = request.data.get('activity3_des', '')
        concept_title = request.data.get('concept_title', '')
        concept_des = request.data.get('concept_des', '')
        course_id = request.data.get('course_id', '')

        #  check
        if not (module_name and module_des and main_assignment_title and main_assignment_des and
                activity1_title and activity2_title and activity3_title and
                activity1_des and activity2_des and activity3_des and
                concept_title and concept_des and course_id):
            return JsonResponse({'error': 'Missing required fields'}, status=400)

        new_module = Modules.objects.create(
            naam=module_name,
            beschrijving = module_des,
            cursus_id = course_id
        )
        HoofdOpdrachten.objects.create(
            naam=main_assignment_title,
            beschrijving = main_assignment_des,
            module_id = new_module.id
        )
        ConceptOpdracht.objects.create(
            naam=concept_title,
            beschrijving=concept_des,
            module_id = new_module.id
        )
        Activiteiten.objects.create(
            naam=activity1_title,
            beschrijving=activity1_des,
            module_id = new_module.id
        )
        Activiteiten.objects.create(
            naam=activity2_title,
            beschrijving=activity2_des,
            module_id = new_module.id
        )
        Activiteiten.objects.create(
            naam=activity3_title,
            beschrijving=activity3_des,
            module_id = new_module.id
        )
        activiteiten = Activiteiten.objects.filter(module=new_module)
        points = 0
        for activiteit in activiteiten:
            for i in range(1,6):
                Niveaus.objects.create(
                    beschrijving="Niveau "+str(i),
                    activiteit=activiteit
                )
                points+=1
        PuntenUitdagingen.objects.create(
            benodige_punten=points,
            module_id = new_module.id
        )
        course_student = IngschrCursus.objects.filter(cursus=course_id)
        for student in course_student:
            add_user_to_module(student.student, new_module)


        return JsonResponse({
            'message': 'Succesvol geregistreerd',
        }, status=200)

    return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)



@api_view(['GET'])
def course_list(request):
    print("User ID:", request.user.id)
    teacher_cursussen = TeacherCursus.objects.filter(user_id=request.user.id)
    cursus_ids = [teacher_cursus.cursus_id for teacher_cursus in teacher_cursussen]
    # op basis van cursus id die is opgehaald vanuit teacher de cursus aantonen
    courses_data = []
    for cursus_id in cursus_ids:
        cursus = Cursussen.objects.get(id=cursus_id)
        courses_data.append({
            'id': cursus.id,
            'naam': cursus.naam,
            'beschrijving': cursus.beschrijving
        })
    return JsonResponse(courses_data, safe=False)


@api_view(['GET'])
def student_list(request, course_id):
    course = get_object_or_404(Cursussen, id=course_id)
    
    students = User.objects.filter(ingschr_cursus=course)
    students_data = [{
        'id': student.id,
        'username': student.username,
        'first_name': student.first_name,
        'last_name': student.last_name,
        'email' : student.email,
    } for student in students]
    print(students_data)
    
    return JsonResponse(students_data, safe=False)


def get_student_voortgang(request, student_id):
    hoofd_opdrachten_voortgang = VoortgangHoofdOpdrachten.objects.filter(
        student_id=student_id, voortgang=1
    ).select_related('hoofd_opdracht').values(
        'id',
        'hoofd_opdracht__naam',
        'hoofd_opdracht__beschrijving'
    )

    concept_opdrachten_voortgang = VoortgangConceptOpdrachten.objects.filter(
        student_id=student_id, voortgang=1
    ).select_related('concept_opdracht').values(
        'id',
        'concept_opdracht__naam',
        'concept_opdracht__beschrijving',
        'ingeleverd_tekst'
    )

    data = {
        "hoofd_opdrachten_voortgang": list(hoofd_opdrachten_voortgang),
        "concept_opdrachten_voortgang": list(concept_opdrachten_voortgang),
    }

    return JsonResponse(data)



@csrf_exempt
@api_view(['POST'])
def approve_assignment(request):
    if request.method == 'POST':
        assignment_id = request.data.get('assignment_id')
        assignment_type = request.data.get('assignment_type')

        if not (assignment_id and assignment_type):
            return JsonResponse({'error': 'Missing required fields'}, status=400)

        try:
            if assignment_type == 'hoofd_opdracht':
                assignment = VoortgangHoofdOpdrachten.objects.get(id=assignment_id)
            elif assignment_type == 'concept_opdracht':
                assignment = VoortgangConceptOpdrachten.objects.get(id=assignment_id)
            else:
                return JsonResponse({'error': 'Invalid assignment type'}, status=400)

            assignment.voortgang = 2  
            assignment.save()

            return JsonResponse({'message': 'Assignment approved successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@api_view(['POST'])
def reject_assignment(request):
    if request.method == 'POST':
        assignment_id = request.data.get('assignment_id')
        assignment_type = request.data.get('assignment_type')  
        print(assignment_id)
        print(assignment_type)

        if not (assignment_id and assignment_type):
            return JsonResponse({'error': 'Missing required fields'}, status=400)

        try:
            if assignment_type == 'hoofd_opdracht':
                assignment = VoortgangHoofdOpdrachten.objects.get(id=assignment_id)
            elif assignment_type == 'concept_opdracht':
                assignment = VoortgangConceptOpdrachten.objects.get(id=assignment_id)
            else:
                return JsonResponse({'error': 'Invalid assignment type'}, status=400)

            assignment.voortgang = 3
            assignment.save()

            return JsonResponse({'message': 'Assignment rejected successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
        

@api_view(['GET'])
def get_student_module_info(request, student_id, cursus_id):
    student = get_object_or_404(User, id=student_id)
    module = get_object_or_404(Modules, id=cursus_id)

    activities = Activiteiten.objects.filter(module=module)
    points_challenge = PuntenUitdagingen.objects.filter(module=module).first()
    context_challenge = ConceptOpdracht.objects.filter(module=module).first()
    core_assignment = HoofdOpdrachten.objects.filter(module=module).first()

    activities_data = [{
        'activity_id': activity.id,
        'activity_name': activity.naam,
        'progress': VoortgangActiviteitenNiveaus.objects.filter(activity=activity, student=student).count(),
        'max_progress': Niveaus.objects.filter(activiteit=activity).count()
    } for activity in activities]

    response_data = {
        'module_id': module.id,
        'module_name': module.naam,
        'module_info': {
            'module_desc': module.beschrijving,
            'nr_of_activities': activities.count()
        },
        'activities': activities_data,
        'points_challenge': {
            'points_challenge_progress': VoortgangPuntenUitdaging.objects.filter(puntenuitdaging=points_challenge, student=student).count(),
            'points_challenge_points': points_challenge.benodige_punten if points_challenge else None,
        },
        'context_challenge': {
            'challenge_name': context_challenge.naam if context_challenge else None,
            'challenge_id': context_challenge.id if context_challenge else None,
        },
        'core_assignment': {
            'challenge_name': core_assignment.naam if core_assignment else None,
            'challenge_id': core_assignment.id if core_assignment else None,
        }
    }

    return JsonResponse(response_data)