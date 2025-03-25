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
    reply_to = serializers.ReadOnlyField(source='reply_to.id')
    replies = serializers.SerializerMethodField()

    def get_is_owner(self, obj):
        request = self.context['request']
        return request.user == obj.owner
    
    def get_replies(self, obj):
        replies = obj.replies.all()
        return CommentSerializer(replies, many=True).data

    class Meta:
        model = Comment
        fields = [
            'id', 'owner', 'profile_id', 'profile_image', 'post', 'body',
            'created_at', 'updated_at', 'is_owner', 'reply_to', 'replies'
        ]


class CommentDetailSerializer(CommentSerializer):
    """
    Serializer for comment detail view.
    """
    post = serializers.ReadOnlyField(source='post.id')