from rest_framework import serializers
from api.models import Personnel,WaitingPoint,WaitingPersonnel

class PersonnelSerializer(serializers.ModelSerializer):
	class Meta:
		model=Personnel 
		fields=('id','name')

class WaitingPointSerializer(serializers.ModelSerializer):
	class Meta:
		model=Personnel 
		fields=('id','name','latitude','longitude')

class WaitingPersonnelSerializer(serializers.ModelSerializer):
	class Meta:
		model=Personnel 
		fields=('id','waiting_point','personnel','time')	