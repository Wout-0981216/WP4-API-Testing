from django.http import JsonResponse
from game.models import ConceptOpdracht, Activiteiten
from rest_framework.decorators import api_view
from django.http import JsonResponse
from game.models import Modules, HoofdOpdrachten, PuntenUitdagingen, ConceptOpdracht, Activiteiten
from django.views.decorators.csrf import csrf_exempt

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
