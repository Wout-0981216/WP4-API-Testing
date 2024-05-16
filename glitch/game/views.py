from django.shortcuts import render
from django.http import JsonResponse
from .models import ConceptOpdracht

def concept_opdracht_list(request):
    if request.method == 'GET':
        opdrachten = ConceptOpdracht.objects.all()
        opdrachten_list = [
            {
                'id': opdracht.id,
                'module': opdracht.module.id,  # Assuming module is a ForeignKey, you might want its id or any other field
                'naam': opdracht.naam,
                'beschrijving': opdracht.beschrijving
            } for opdracht in opdrachten
        ]
        return JsonResponse(opdrachten_list, safe=False)