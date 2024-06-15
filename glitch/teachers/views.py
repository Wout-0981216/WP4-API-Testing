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

@csrf_exempt
@api_view(['POST'])
def register_domain(request):
    if request.method == 'POST':
        domain_name = request.data.get('domain_name', '')
        domain_desc = request.data.get('domain_desc', '')

        if not (domain_name and domain_desc):
            return JsonResponse({'error': 'Missing required fields'}, status=400)

        Domeinen.objects.create(
            naam = domain_name,
            beschrijving = domain_desc
        )
        return JsonResponse({
            'message': 'Succesvol geregistreerd',
        }, status=200)

    return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)


@csrf_exempt
@api_view(['POST'])
def register_course(request):
    if request.method == 'POST':
        course_name = request.data.get('course_name', '')
        course_desc = request.data.get('course_desc', '')
        domain_id = request.data.get('domain_id', '')

        if not (course_name and course_desc and domain_id):
            return JsonResponse({'error': 'Missing required fields'}, status=400)

        new_course = Cursussen.objects.create(
            naam = course_name,
            beschrijving = course_desc,
            domein_id = domain_id
        )
        TeacherCursus.objects.create(
            user=request.user,
            cursus = new_course
        )
        ingschr_at_domain = IngschrDomein.objects.filter(domein_id=domain_id) #adds every student that is registered to this domain to the new course!
        for ingschr_student in ingschr_at_domain:
            IngschrCursus.objects.create(
                student = ingschr_student.student,
                cursus = new_course
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
    return JsonResponse(courses_data, safe=False)


@api_view(['GET'])
def student_list(request, course_id):
    course = get_object_or_404(Cursussen, id=course_id)
    
    students = User.objects.filter(ingschr_cursus=course, is_teacher=False)
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
def get_student_module_info(request, student_id, course_id):
    try:
        # Fetching module related information
        modules = Modules.objects.filter(cursus_id=course_id)
        if not modules:
            return JsonResponse({'error': 'Module not found for this course'}, status=404)
        modules_data = []
        hoofd_opdrachten_data = []
        concept_opdrachten_data = []
        punten_uitdagingen_data = []
        activiteiten_module_data = []
        for module in modules:

            modules_data.append({'id': module.id, 'naam': module.naam, 'beschrijving': module.beschrijving})

            # Fetching main assignments (HoofdOpdrachten)
            hoofd_opdracht = HoofdOpdrachten.objects.get(module=module)
            voortgang = VoortgangHoofdOpdrachten.objects.get(student_id=student_id, hoofd_opdracht=hoofd_opdracht)
            hoofd_opdrachten_data.append({'id': hoofd_opdracht.id, 'naam': hoofd_opdracht.naam, 'beschrijving': hoofd_opdracht.beschrijving, 'progress': voortgang.voortgang})

            # Fetching concept assignments (ConceptOpdracht)
            concept_opdracht = ConceptOpdracht.objects.get(module=module)
            voortgang = VoortgangConceptOpdrachten.objects.get(student_id=student_id, concept_opdracht=concept_opdracht)
            concept_opdrachten_data.append({'id': concept_opdracht.id, 'naam': concept_opdracht.naam, 'beschrijving': concept_opdracht.beschrijving, 'progress': voortgang.voortgang})

            # Fetching points challenges (PuntenUitdagingen)
            punten_uitdaging = PuntenUitdagingen.objects.get(module=module)
            voortgang = VoortgangPuntenUitdaging.objects.get(student_id=student_id, punten_uitdaging=punten_uitdaging)
            punten_uitdagingen_data.append({'id': punten_uitdaging.id, 'progress': voortgang.voortgang})

            # Fetching activities (Activiteiten)
            activiteiten = Activiteiten.objects.filter(module=module)
            activiteiten_data = []
            for activiteit in activiteiten:
                niveau_data = []
                niveaus = Niveaus.objects.filter(activiteit=activiteit)
                for niveau in niveaus:
                    niveau_data.append({'beschrijving': niveau.beschrijving, 'id': niveau.id, 'progress': VoortgangActiviteitenNiveaus.objects.get(student_id=student_id, niveau=niveau).voortgang})
                activiteiten_data.append({'id': activiteit.id, 'naam': activiteit.naam, 'beschrijving': activiteit.beschrijving, 'niveaus': niveau_data})
            activiteiten_module_data.append(activiteiten_data)


        data = {
            'modules': modules_data,
            'hoofd_opdrachten': hoofd_opdrachten_data,
            'concept_opdrachten': concept_opdrachten_data,
            'punten_uitdagingen': punten_uitdagingen_data,
            'activiteiten': activiteiten_module_data,
        }

        return JsonResponse(data)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
