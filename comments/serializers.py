from django.contrib.humanize.templatetags.humanize import naturaltime
from django.db.models import Count
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
    replies = serializers.ReadOnlyField(source='replies.count')
    created_at = serializers.SerializerMethodField()
    updated_at = serializers.SerializerMethodField()
    reaction_id = serializers.SerializerMethodField()
    reaction_type_id = serializers.SerializerMethodField()
    reaction_type = serializers.SerializerMethodField()
    reactions_count = serializers.ReadOnlyField()
    popular_reactions = serializers.SerializerMethodField()
    comments_count = serializers.ReadOnlyField()

    # returns a boolean indicating if the user is the owner of the comment
    def get_is_owner(self, obj):
        request = self.context['request']
        return request.user == obj.owner
    
    # returns a humanized representation of the time since the comment was created
    def get_created_at(self, obj):
        return naturaltime(obj.created_at)
    
    # returns a humanized representation of the time since the comment was last updated
    def get_updated_at(self, obj):
        return naturaltime(obj.updated_at)
    
    # returns the id of the user's reaction to the comment
    def get_reaction_id(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            reaction = obj.reactions.filter(owner=user).first()
            return reaction.id if reaction else None
        return None
    
    # returns the id of the type of reaction the user has had to the comment
    def get_reaction_type_id(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            reaction = obj.reactions.filter(owner=user).first()
            return reaction.reaction if reaction else None
        return None
    
    # returns the string of type of reaction the user has had to the comment
    def get_reaction_type(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            reaction = obj.reactions.filter(owner=user).first()
            return reaction.get_reaction_display() if reaction else None
        return None
    
    # returns the number of reactions by type to the comment
    def get_popular_reactions(self, obj):
        reactions = obj.reactions.values('reaction').annotate(
            count=Count('reaction')
        ).order_by('-count')
        return reactions

    class Meta:
        model = Comment
        fields = [
            'id', 'owner', 'profile_id', 'profile_image', 'post', 'body',
            'created_at', 'updated_at', 'is_owner', 'reaction_id',
            'reaction_type_id', 'reaction_type', 'replies', 'reactions_count',
            'comments_count', 'popular_reactions'
        ]


class CommentDetailSerializer(CommentSerializer):
    """
    Serializer for comment detail view.
    """
    post = serializers.ReadOnlyField(source='post.id')
    replies = serializers.SerializerMethodField()

    # returns a list of ids of replies to the comment
    def get_replies(self, obj):
        replies = obj.replies.all()
        reply_list = []
        for reply in replies:
            reply_list.append(reply.id)
        return reply_list if replies else None