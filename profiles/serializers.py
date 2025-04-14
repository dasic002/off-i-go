from rest_framework import serializers
from .models import Profile
from followers.models import Follower
from taggit.serializers import (
    TagListSerializerField, TaggitSerializer
)


class ProfileSerializer(TaggitSerializer, serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    is_owner = serializers.SerializerMethodField()
    following_id = serializers.SerializerMethodField()
    posts_count = serializers.ReadOnlyField()
    followers_count = serializers.ReadOnlyField()
    following_count = serializers.ReadOnlyField()
    interests = TagListSerializerField(default=[])
    latitude = serializers.SerializerMethodField()
    longitude = serializers.SerializerMethodField()

    def get_is_owner(self, obj):
        request = self.context['request']
        return request.user == obj.owner
    
    def get_following_id(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            following = Follower.objects.filter(
                owner=user, followed=obj.owner
            ).first()
            return following.id if following else None
        return None
    
    def get_latitude(self, obj):
        user = self.context['request'].user
        is_owner = user == obj.owner
        if (user.is_authenticated and is_owner and obj.latitude):
            return obj.latitude
        return None
    
    def get_longitude(self, obj):
        user = self.context['request'].user
        is_owner = user == obj.owner
        if (user.is_authenticated and is_owner and obj.longitude):
            return obj.longitude
        return None
    
    class Meta:
        model = Profile
        fields = [
            'id', 'owner', 'image', 'content', 'account_type', 'verified',
            'created_at', 'updated_at', 'is_owner', 'following_id',
            'posts_count', 'followers_count', 'following_count', 'interests',
            'latitude', 'longitude'
        ]