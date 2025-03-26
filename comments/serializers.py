from django.contrib.humanize.templatetags.humanize import naturaltime
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
    created_at = serializers.SerializerMethodField()
    updated_at = serializers.SerializerMethodField()
    reaction_id = serializers.SerializerMethodField()
    reaction_type_id = serializers.SerializerMethodField()
    reaction_type = serializers.SerializerMethodField()

    def get_is_owner(self, obj):
        request = self.context['request']
        return request.user == obj.owner
    
    def get_created_at(self, obj):
        return naturaltime(obj.created_at)
    
    def get_updated_at(self, obj):
        return naturaltime(obj.updated_at)
    
    def get_replies(self, obj):
        replies = obj.replies.all()
        return CommentSerializer(replies, many=True).data
    
    def get_reaction_id(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            reaction = obj.reactions.filter(owner=user).first()
            return reaction.id if reaction else None
        return None
    
    def get_reaction_type_id(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            reaction = obj.reactions.filter(owner=user).first()
            return reaction.reaction if reaction else None
        return None
    
    def get_reaction_type(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            reaction = obj.reactions.filter(owner=user).first()
            return reaction.get_reaction_display() if reaction else None
        return None

    class Meta:
        model = Comment
        fields = [
            'id', 'owner', 'profile_id', 'profile_image', 'post', 'body',
            'created_at', 'updated_at', 'is_owner', 'reply_to', 'replies',
            'reaction_id', 'reaction_type_id', 'reaction_type'
        ]


class CommentDetailSerializer(CommentSerializer):
    """
    Serializer for comment detail view.
    """
    post = serializers.ReadOnlyField(source='post.id')