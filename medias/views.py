from rest_framework import generics, permissions
from off_i_go.permissions import IsOwnerOrReadOnly
from .models import Media
from .serializers import MediaSerializer, MediaDetailSerializer


class MediaList(generics.ListCreateAPIView):
    """
    List all media or create a new media.
    """
    serializer_class = MediaSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Media.objects.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class MediaDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a media instance.
    """
    serializer_class = MediaDetailSerializer
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Media.objects.all()