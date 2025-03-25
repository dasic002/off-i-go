from rest_framework import generics
from .models import Profile
from .serializers import ProfileSerializer
from off_i_go.permissions import IsOwnerOrReadOnly


class ProfileList(generics.ListCreateAPIView):
    """
    List all profiles or create a new profile.
    """
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()


class ProfileDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a profile instance.
    """
    serializer_class = ProfileSerializer
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Profile.objects.all()