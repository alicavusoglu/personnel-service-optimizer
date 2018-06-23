from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from api import views

urlpatterns = [
    url(r'^personnels/$', views.PersonnelList.as_view()),
    url(r'^personnel/(?P<pk>[0-9]+)$', views.PersonnelDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)