from rest_framework import serializers
from django.db.models import Count
from .models import Post
from django.contrib.contenttypes.models import ContentType
from medias.models import Media
from taggit.serializers import (
    TagListSerializerField, TaggitSerializer
)
import json
from math import radians, sin, cos, sqrt, asin


class PostSerializer(TaggitSerializer, serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    is_owner = serializers.SerializerMethodField()
    profile_id = serializers.ReadOnlyField(source='owner.profile.id')
    profile_image = serializers.ReadOnlyField(source='owner.profile.image.url')
    reaction_id = serializers.SerializerMethodField()
    reaction_type_id = serializers.SerializerMethodField()
    reaction_type = serializers.SerializerMethodField()
    reactions_count = serializers.ReadOnlyField()
    popular_reactions = serializers.SerializerMethodField()
    comments_count = serializers.ReadOnlyField()
    content_type = serializers.SerializerMethodField()
    distance = serializers.SerializerMethodField()

    def get_content_type(self, obj):
        """
        Get the content type of the post.
        """
        return ContentType.objects.get_for_model(obj).id

    tags = TagListSerializerField(
        required=False,
        default=[],
    )
    
    tagged_interest = serializers.SerializerMethodField()

    media = serializers.PrimaryKeyRelatedField(
        queryset = Media.objects.all(),
        many=True,
        required=False,
        default=None,
        allow_null=True,
    )

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
    
    def get_popular_reactions(self, obj):
        reactions = obj.reactions.values('reaction').annotate(
            count=Count('reaction')
        ).order_by('-count')
        return reactions
    
    def get_tagged_interest(self, obj):
        """
        Get list of matching tags between profile interests and post.
        """
        user = self.context['request'].user
        if user.is_authenticated and obj.tags.exists():
            profile = user.profile
            interests = [
                tag for tag in obj.tags.names() if
                tag in profile.interests.names()
            ]
            return interests if interests else None
        return None
    
    def distance_to_user(self, obj, latitude, longitude):
        """
        Calculate the distance between two points on the earth.
        """
        if not (latitude and longitude):
            return None
        R = 6371  # Radius of the Earth in kilometers
        lat1 = radians(latitude)
        lon1 = radians(longitude)
        lat2 = radians(obj.latitude)
        lon2 = radians(obj.longitude)
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        # square of half the chord length between the points
        a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
        # Haversine formula to calculate the distance
        distance = 2 * R * asin(sqrt(a))  # Distance in kilometers
        return distance
    
    def get_distance(self, obj):
        """
        Get the distance between the post and the user's location.
        """
        data = self.context['request'].query_params.get('nearby', None)
        user = self.context['request'].user
        print(f"User: {user}, Data: {data}")
        
        if data and obj.latitude and obj.longitude:
            data = json.loads(data)
            latitude = float(data.get('latitude'))
            longitude = float(data.get('longitude'))
            print(f"Latitude: {latitude}, Longitude: {longitude}")
            return self.distance_to_user(obj, latitude, longitude)
        
        elif user.is_authenticated and obj.latitude and obj.longitude:
            latitude = user.profile.latitude
            longitude = user.profile.longitude
            return self.distance_to_user(obj, latitude, longitude) if latitude and longitude else None
        else:
            return None
         
    class Meta:
        model = Post
        fields = [
            'content_type', 'id', 'owner', 'profile_id', 'profile_image',
            'title', 'body', 'media', 'listing_type', 'original_post',
            'created_at','updated_at', 'is_owner', 'reaction_id',
            'reaction_type_id', 'reaction_type', 'reactions_count',
            'comments_count', 'popular_reactions', 'tags', 'tagged_interest',
            'latitude', 'longitude', 'distance'
        ]