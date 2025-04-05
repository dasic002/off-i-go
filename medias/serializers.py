from django.db.models import Count
from rest_framework import serializers
from .models import Media
from django.contrib.contenttypes.models import ContentType
from django.db.models import Q
from posts.models import Post
from posts.serializers import PostSerializer


class MediaSerializer(serializers.ModelSerializer):
    """
    Serializer for media list view.
    """
    owner = serializers.ReadOnlyField(source='owner.username')
    is_owner = serializers.SerializerMethodField()
    profile_id = serializers.ReadOnlyField(source='owner.profile.id')
    profile_image = serializers.ReadOnlyField(source='owner.profile.image.url')
    
    def get_is_owner(self, obj):
        request = self.context['request']
        return request.user == obj.owner

    class Meta:
        model = Media
        fields = [
            'id', 'owner', 'profile_id', 'profile_image', 'media_type',
            'image', 'video', 'description', 'created_at',
            'updated_at', 'is_owner'
        ]


class MediaDetailSerializer(MediaSerializer):
    """
    Serializer for media detail view.
    """
    used_in = serializers.ReadOnlyField(
        source='posts.count'
    )
    
    class Meta(MediaSerializer.Meta):
        """
        Meta class for MediaDetailSerializer, inherits
        fields from MediaSerializer and adds used_in.
        """
        fields = MediaSerializer.Meta.fields + ['used_in']