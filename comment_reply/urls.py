from django.urls import path
from comment_reply import views

urlpatterns = [
    path('comment-replies/', views.CommentReplyList.as_view()),
    path('comment-replies/<int:pk>/', views.CommentReplyDetail.as_view()),
]