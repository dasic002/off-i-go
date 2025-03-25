from django.db import IntegrityError
from rest_framework import serializers
from .models import Reaction


class ReactionSerializer(serializers.ModelSerializer):
    """
    Serializer for reaction list view.
    """
    owner = serializers.ReadOnlyField(source='owner.username')
    is_owner = serializers.SerializerMethodField()
    profile_id = serializers.ReadOnlyField(source='owner.profile.id')
    profile_image = serializers.ReadOnlyField(source='owner.profile.image.url')

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