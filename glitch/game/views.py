from django.shortcuts import render
from django.http import JsonResponse
from game.models import ConceptOpdracht
from . import models
from rest_framework.decorators import api_view

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