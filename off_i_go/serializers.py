from dj_rest_auth.serializers import UserDetailsSerializer
from rest_framework import serializers


class CurrentUserSerializer(UserDetailsSerializer):
    profile_id = serializers.ReadOnlyField(source='profile.id')
    profile_image = serializers.ReadOnlyField(source='profile.image.url')
    profile_interests = serializers.SerializerMethodField()

    def get_profile_interests(self, obj):
        """
        Get the profile interests of the user.
        """
        interests = [interest.name for interest in obj.profile.interests.all()]

        string = ','.join(interests)
        print(string)

        return string

    class Meta(UserDetailsSerializer.Meta):
        fields = UserDetailsSerializer.Meta.fields + (
            'profile_id', 'profile_image', 'profile_interests',
        )