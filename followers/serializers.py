from django.db.utils import IntegrityError
from rest_framework import serializers
from .models import Follower


class FollowerSerializer(serializers.ModelSerializer):
    """
    Serializer for the Follower model.
    """
    owner = serializers.ReadOnlyField(source='owner.username')
    is_follower = serializers.SerializerMethodField()
    followed_name = serializers.ReadOnlyField(source='followed.username')
    is_followed = serializers.SerializerMethodField()

    def get_is_follower(self, obj):
        request = self.context['request']
        return request.user == obj.owner
    
    def get_is_followed(self, obj):
        request = self.context['request']
        return request.user == obj.followed

    class Meta:
        model = Follower
        fields = [
            'id', 'owner', 'is_follower', 'followed', 'followed_name',
            'is_followed', 'created_at'
        ]
    
    def create(self, validated_data):
        try:
            return super().create(validated_data)
        except IntegrityError:
            raise serializers.ValidationError(
                {
                    'detail': (
                        'You are already following this user.'
                    )
                }
            )