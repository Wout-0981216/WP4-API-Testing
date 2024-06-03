from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from game.models import Cursussen, User, VoortgangConceptOpdrachten, TeacherCursus


@api_view(['GET'])
def course_list(request):
    print("Request headers:", request.headers)
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
    
    print("daya is",courses_data)
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
    } for student in students]
    
    return JsonResponse(students_data, safe=False)
