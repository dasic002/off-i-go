from rest_framework import generics, permissions
from off_i_go.permissions import IsOwnerOrReadOnly
from .models import Reaction
from .serializers import ReactionSerializer, ReactionDetailSerializer


class ReactionList(generics.ListCreateAPIView):
    """
    List all reactions or create a new reaction.
    """
    serializer_class = ReactionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Reaction.objects.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ReactionDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a reaction instance.
    """
    serializer_class = ReactionDetailSerializer
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Reaction.objects.all()