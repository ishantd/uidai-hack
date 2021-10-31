from django.urls import path

from checkin import views

app_name = 'checkin'

urlpatterns = [
    path('verify/', views.MatchFaces.as_view(), name='match-faces'),
]
