# views.py
from .models import User, Cursussen
from django.http import JsonResponse
from django.http import JsonResponse
from rest_framework.decorators import api_view,  permission_classes
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def HomeCourses(request):
    if request.method == 'GET':
        user_id = request.user.id
        course_ids = User.objects.filter(id=user_id).values_list('ingschr_cursus__id', flat=True)
        courses = Cursussen.objects.filter(id__in=course_ids)
        course_names = [course.naam for course in courses]
        if course_names:
            return JsonResponse({'courses': course_names, 'message': 'Cursussen gevonden'})
        else:
            return JsonResponse({'message': 'Geen cursussen gevonden voor deze gebruiker'})