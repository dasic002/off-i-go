from django.db import IntegrityError
from rest_framework import serializers
from .models import Reaction
from django.contrib.contenttypes.models import ContentType
from django.db.models import Q
from posts.models import Post
from comments.models import Comment


class ReactionSerializer(serializers.ModelSerializer):
    """
    Serializer for reaction list view.
    """
    owner = serializers.ReadOnlyField(source='owner.username')
    is_owner = serializers.SerializerMethodField()
    profile_id = serializers.ReadOnlyField(source='owner.profile.id')
    profile_image = serializers.ReadOnlyField(source='owner.profile.image.url')

    content_type = serializers.PrimaryKeyRelatedField(
        queryset=ContentType.objects.filter(
            Q(app_label='posts', model='post') | Q(app_label='comments', model='comment')
        )
    )

    # object_id = serializers.PrimaryKeyRelatedField(
    #     queryset_post= Post.objects.all(),
    #     queryset_comment= Comment.objects.all(),
    #     queryset=queryset_post + queryset_comment
    # )

    def get_is_owner(self, obj):
        request = self.context['request']
        return request.user == obj.owner

    class Meta:
        model = Reaction
        fields = [
            'id', 'owner', 'profile_id', 'profile_image', 'reaction_to',
            'content_type', 'object_id',
            'reaction', 'created_at', 'updated_at', 'is_owner'
        ]
    
    def create(self, validated_data):
        try:
            return super().create(validated_data)
        except IntegrityError:
            raise serializers.ValidationError(
                {
                    'detail': (
                        'You have already reacted to this post.'
                        ' Please update your reaction instead.'
                    )
                }
            )
        

class ReactionDetailSerializer(ReactionSerializer):
    """
    Serializer for reaction detail view.
    """
    reaction_to = serializers.ReadOnlyField(source='content_object.__str__')