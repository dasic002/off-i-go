from django.db.models import Count
from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from off_i_go.permissions import IsOwnerOrReadOnly
from .models import Comment
from .serializers import (
    CommentSerializer,
    CommentDetailSerializer
)


class CommentList(generics.ListCreateAPIView):
    """
    List all comments or create a new comment.
    """
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Comment.objects.annotate(
        reactions_count=Count('reactions', distinct=True),
        replies_count=Count('replies', distinct=True)
    ).order_by('-created_at')
    filter_backends = [
        filters.OrderingFilter,
        filters.SearchFilter,
        DjangoFilterBackend,
    ]
    filterset_fields = [
        'post',
    ]
    search_fields = [
        'owner__username',
    ]
    ordering_fields = [
        'reactions_count',
        'replies_count',
        'reactions__created_at',
    ]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class CommentDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a comment instance.
    """
    serializer_class = CommentDetailSerializer
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Comment.objects.annotate(
        reactions_count=Count('reactions', distinct=True),
        replies_count=Count('replies', distinct=True)
    ).order_by('-created_at')