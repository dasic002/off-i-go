from rest_framework import serializers
from .models import Comment


class CommentSerializer(serializers.ModelSerializer):
    """
    Serializer for comment list view.
    """
    owner = serializers.ReadOnlyField(source='owner.username')
    is_owner = serializers.SerializerMethodField()
    profile_id = serializers.ReadOnlyField(source='owner.profile.id')
    profile_image = serializers.ReadOnlyField(source='owner.profile.image.url')

    def get_is_owner(self, obj):
        request = self.context['request']
        return request.user == obj.owner
    
    class Meta:
        model = Comment
        fields = [
            'id', 'owner', 'profile_id', 'profile_image', 'post', 'body',
            'created_at', 'updated_at', 'is_owner'
        ]


class CommentDetailSerializer(CommentSerializer):
    """
    Serializer for comment detail view.
    """
    post = serializers.ReadOnlyField(source='post.id')