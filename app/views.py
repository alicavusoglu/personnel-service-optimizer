from django.http import HttpResponse
from api.models import Personnel
from django.shortcuts import render

def index(request):
	#o1=Personnel.objects.all()
	#output=', '.join([q.name for q in o1])
	#return HttpResponse(o1)
	return render(request, 'app/index.html')

def detail(request, question_id):
    return HttpResponse("You're looking at question %s." % question_id)