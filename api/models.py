from django.db import models

class Personnel(models.Model):
    name = models.CharField(max_length=100, blank=True, default='')

class WaitingPoint(models.Model):
	name = models.CharField(max_length=100, blank=True, default='')
	latitude = models.CharField(max_length=100, blank=True, default='')
	longitude = models.CharField(max_length=100, blank=True, default='')

class WaitingPersonnel(models.Model):
	waiting_point=models.ForeignKey(WaitingPoint,on_delete=models.CASCADE)
	personnel=models.ForeignKey(Personnel,on_delete=models.CASCADE)
	time=models.DateTimeField(auto_now=True)