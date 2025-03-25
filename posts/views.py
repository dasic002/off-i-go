from rest_framework import permissions, generics
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
    queryset = Post.objects.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a post instance.
    """
    serializer_class = PostSerializer
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Post.objects.all()