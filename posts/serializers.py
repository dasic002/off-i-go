from rest_framework import serializers
from .models import Post


class PostSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    is_owner = serializers.SerializerMethodField()
    profile_id = serializers.ReadOnlyField(source='owner.profile.id')
    profile_image = serializers.ReadOnlyField(source='owner.profile.image.url')
    reaction_id = serializers.SerializerMethodField()
    reaction_type_id = serializers.SerializerMethodField()
    reaction_type = serializers.SerializerMethodField()

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

    def get_is_owner(self, obj):
        request = self.context['request']
        return request.user == obj.owner

    class Meta:
        model = Post
        fields = [
            'id', 'owner', 'profile_id', 'profile_image', 'title', 'body',
            'listing_type', 'original_post', 'created_at', 'updated_at',
            'is_owner', 'reaction_id', 'reaction_type_id', 'reaction_type'
        ]