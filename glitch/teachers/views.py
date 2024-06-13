from django.http import JsonResponse
from game.models import ConceptOpdracht, Activiteiten
from rest_framework.decorators import api_view
from django.http import JsonResponse
from game.models import Modules, HoofdOpdrachten, PuntenUitdagingen, ConceptOpdracht, Activiteiten, VoortgangActiviteitenNiveaus, VoortgangConceptOpdrachten, VoortgangHoofdOpdrachten, VoortgangPuntenUitdaging
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from game.models import Cursussen, User, TeacherCursus

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
        points_challange_points = request.data.get('points_challange_points', '')
        course_id = request.data.get('course_id', '')

        #  check
        if not (module_name and module_des and main_assignment_title and main_assignment_des and
                activity1_title and activity2_title and activity3_title and
                activity1_des and activity2_des and activity3_des and
                concept_title and concept_des and points_challange_points and course_id):
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
        PuntenUitdagingen.objects.create(
            benodige_punten=points_challange_points,
            module_id = new_module.id
        )


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
    print("data is",courses_data)
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
        'hoofd_opdracht__naam', 'hoofd_opdracht__beschrijving'
    )

    concept_opdrachten_voortgang = VoortgangConceptOpdrachten.objects.filter(
        student_id=student_id, voortgang=1
    ).select_related('concept_opdracht').values(
        'concept_opdracht__naam', 'concept_opdracht__beschrijving'
    )

    punten_uitdaging_voortgang = VoortgangPuntenUitdaging.objects.filter(
        student_id=student_id, voortgang__gte=1
    ).select_related('punten_uitdaging').values(
        'punten_uitdaging__benodige_punten', 'punten_uitdaging__module__naam'
    )

    activiteiten_niveaus_voortgang = VoortgangActiviteitenNiveaus.objects.filter(
        student_id=student_id, voortgang=1
    ).select_related('niveau').values(
        'niveau__beschrijving', 'niveau__activiteit__naam'
    )

    data = {
        "hoofd_opdrachten_voortgang": list(hoofd_opdrachten_voortgang),
        "concept_opdrachten_voortgang": list(concept_opdrachten_voortgang),
        "punten_uitdaging_voortgang": list(punten_uitdaging_voortgang),
        "activiteiten_niveaus_voortgang": list(activiteiten_niveaus_voortgang)
    }

    return JsonResponse(data)