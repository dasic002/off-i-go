from django.db.models import Count
from rest_framework import generics, permissions, filters
from off_i_go.permissions import IsOwnerOrReadOnly
from .models import CommentReply
from .serializers import (
    CommentReplySerializer,
    CommentReplyDetailSerializer
)


class CommentReplyList(generics.ListCreateAPIView):
    """
    List all comment replies or create a new comment reply.
    """
    serializer_class = CommentReplySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = CommentReply.objects.annotate(
        reactions_count=Count('reactions', distinct=True)
    ).order_by('-created_at')
    filter_backends = [
        filters.OrderingFilter
    ]
    ordering_fields = [
        'reactions_count',
        'reactions__created_at',
    ]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class CommentReplyDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a comment reply instance.
    """
    serializer_class = CommentReplyDetailSerializer
    permission_classes = [IsOwnerOrReadOnly]
    queryset = CommentReply.objects.annotate(
        reactions_count=Count('reactions', distinct=True)
    ).order_by('-created_at')