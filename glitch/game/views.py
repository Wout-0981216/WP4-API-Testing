
from django.shortcuts import render
from django.http import JsonResponse
from game.models import ConceptOpdracht, Activiteiten, User, Cursussen
from . import models
from rest_framework.decorators import api_view, permission_classes
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
def concept_opdracht_list(request):
    if request.method == 'GET':
        opdrachten = ConceptOpdracht.objects.all()
        opdrachten_list = [
            {
                'id': opdracht.id,
                'module_id': opdracht.module.id,
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
                'module_id': activities.module.id,
                'naam': activities.naam,
                'beschrijving': activities.beschrijving
            } for activities in activities_module
        ]
        return JsonResponse(activities_list, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def HomeCourses(request):
    if request.method == 'GET':
        user_id = request.user.id
        user_name = request.user.username
        course_ids = User.objects.filter(id=user_id).values_list('ingschr_cursus__id', flat=True)
        courses = Cursussen.objects.filter(id__in=course_ids)
        courses_data = [{'naam': course.naam, 'beschrijving': course.beschrijving} for course in courses]
        if courses_data:
            return JsonResponse({'courses': courses_data, 'name': user_name, 'message': 'Cursussen gevonden'})
        else:
            return JsonResponse({'name': user_name, 'message': 'Geen cursussen gevonden voor deze gebruiker'})
