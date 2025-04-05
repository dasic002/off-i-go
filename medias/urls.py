from django.urls import path
from medias import views


urlpatterns = [
    path('medias/', views.MediaList.as_view()),
    path('medias/<int:pk>/', views.MediaDetail.as_view()),
]