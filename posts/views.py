from django.db.models import Count
from rest_framework import permissions, generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Post
from .serializers import PostSerializer
from off_i_go.permissions import IsOwnerOrReadOnly

class PostList(generics.ListCreateAPIView):
    """
    List all posts or create a new post.
    """
    serializer_class = PostSerializer
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    queryset = Post.objects.annotate(
        reactions_count=Count('reactions', distinct=True),
        comments_count=(
            Count('comments', distinct=True)
            + Count('comments__replies', distinct=True)
        )
    ).order_by('-created_at')
    filter_backends = [
        filters.OrderingFilter,
        filters.SearchFilter,
        DjangoFilterBackend,
    ]
    filterset_fields = [
        'owner__followed__owner__profile',
        'reactions__owner__profile',
        'owner__profile',
        'tags__id',
        'tags__slug',
        'comments__owner__profile',
        'comments__replies__owner__profile',
    ]
    search_fields = [
        'title',
        'owner__username',
    ]
    ordering_fields = [
        'reactions_count',
        'comments_count',
        'reactions__created_at',
    ]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a post instance.
    """
    serializer_class = PostSerializer
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Post.objects.annotate(
        reactions_count=Count('reactions', distinct=True),
        comments_count=(
            Count('comments', distinct=True)
            + Count('comments__replies', distinct=True)
        )
    ).order_by('-created_at')