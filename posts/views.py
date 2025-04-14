from django.db.models import Count
from rest_framework import permissions, generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Post
from .serializers import PostSerializer
from off_i_go.permissions import IsOwnerOrReadOnly
import json
from posts.filters import PostDistanceFilter


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

    filterset_class = PostDistanceFilter

    # filterset_fields = [
    #     'owner__followed__owner__profile',
    #     'reactions__owner__profile',
    #     'owner__profile',
    #     'tags__id',
    #     'tags__slug',
    #     'comments__owner__profile',
    #     'comments__replies__owner__profile',
    # ]
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
    
    def get_queryset(self):
        """
        Filter posts based on latitude and longitude.
        """
        data = self.request.query_params.get('nearby', None)
        if data:
            data = json.loads(data)
            latitude = float(data.get('latitude'))
            longitude = float(data.get('longitude'))
            
            if latitude and longitude:
                queryset = Post.objects.filter(
                    latitude__isnull=False,
                    longitude__isnull=False,
                )
                return queryset
            else:
                pass
        else:
            return Post.objects.annotate(
                reactions_count=Count('reactions', distinct=True),
                comments_count=(
                    Count('comments', distinct=True)
                    + Count('comments__replies', distinct=True)
                )
            ).order_by('-created_at')


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