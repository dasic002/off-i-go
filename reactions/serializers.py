from django.db import IntegrityError
from rest_framework import serializers
from .models import Reaction
from django.contrib.contenttypes.models import ContentType
from django.db.models import Q
from posts.models import Post
from comments.models import Comment
from comment_reply.models import CommentReply


class ReactionSerializer(serializers.ModelSerializer):
    """
    Serializer for reaction list view.
    """
    owner = serializers.ReadOnlyField(source='owner.username')
    is_owner = serializers.SerializerMethodField()
    profile_id = serializers.ReadOnlyField(source='owner.profile.id')
    profile_image = serializers.ReadOnlyField(source='owner.profile.image.url')

    # filter content type to only posts, comments and comment replies
    content_type = serializers.PrimaryKeyRelatedField(
        queryset=ContentType.objects.filter(
            Q(app_label='posts', model='post') |
            Q(app_label='comments', model='comment') |
            Q(app_label='comment_reply', model='commentreply')
        )
    )

    def get_is_owner(self, obj):
        request = self.context['request']
        return request.user == obj.owner

    class Meta:
        model = Reaction
        fields = [
            'id', 'owner', 'profile_id', 'profile_image', 'reaction_to',
            'content_type', 'object_id', 'reaction', 'created_at',
            'updated_at', 'is_owner'
        ]
    
    def create(self, validated_data):
        """
        Check for errors on create of a new reaction instance.
        """
        try:
            # Check if reaction is to a post
            if validated_data['content_type'].model == 'post':
                id=validated_data['object_id']

                if Post.objects.filter(id=id).exists() is False:
                    # Check if post exists
                    raise serializers.ValidationError(
                        {'detail': 'Post not found.'}
                    )
                elif Post.objects.get(id=id).owner == validated_data['owner']:
                    # Check if user is reacting to their own post
                    raise serializers.ValidationError(
                        {'detail': 'You cannot react to your own post.'}
                    )
            # Check if reaction is to a comment
            elif validated_data['content_type'].model == 'comment':
                id=validated_data['object_id']

                if Comment.objects.filter(id=id).exists() is False:
                    # Check if comment exists
                    raise serializers.ValidationError(
                        {'detail': 'Comment not found.'}
                    )
                elif Comment.objects.get(id=id).owner == validated_data['owner']:
                    # Check if user is reacting to their own comment
                    raise serializers.ValidationError(
                        {'detail': 'You cannot react to your own comment.'}
                    )
                
            # Check if reaction is to a comment reply
            elif validated_data['content_type'].model == 'commentreply':
                id=validated_data['object_id']

                if CommentReply.objects.filter(id=id).exists() is False:
                    # Check if comment_reply exists
                    raise serializers.ValidationError(
                        {'detail': 'Comment reply not found.'}
                    )
                elif CommentReply.objects.get(id=id).owner == validated_data['owner']:
                    # Check if user is reacting to their own comment reply
                    raise serializers.ValidationError(
                        {'detail': 'You cannot react to your own comment reply.'}
                    )
            
            return super().create(validated_data)
        except IntegrityError:
            # Check if user has already reacted to the post/comment
            # or comment reply and supply the reaction id
            # to update the reaction
            raise serializers.ValidationError(
                {
                    'detail': (
                        f'You have already reacted to this {
                            validated_data['content_type'].model}.'
                        f' Please update your reaction id:{
                            Reaction.objects.get(
                                content_type=validated_data["content_type"],
                                object_id=validated_data["object_id"],
                                owner=validated_data["owner"]).id}.'
                    )
                }
            )
        

class ReactionDetailSerializer(ReactionSerializer):
    """
    Serializer for reaction detail view.
    """
    reaction_to = serializers.ReadOnlyField(source='content_object.__str__')