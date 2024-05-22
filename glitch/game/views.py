from .models import User, Cursussen
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

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
            return JsonResponse({'message': 'Geen cursussen gevonden voor deze gebruiker'})
