import django_filters
from posts.models import Post

class PostFilter(django_filters.FilterSet):
    """

    """
    class Meta:
        model = Post
        fields = {
            'owner__followed__owner__profile': ['exact'],
            'reactions__owner__profile': ['exact'],
            'owner__profile': ['exact'],
            'tags__id': ['exact'],
            'tags__slug': ['icontains', 'isnull', 'in'],
            'tags__name': ['icontains', 'isnull', 'in'],
            'comments__owner__profile': ['exact'],
            'comments__replies__owner__profile': ['exact'],
            'media': ['exact'],
            'listing_type': ['exact', 'in'],
            'original_post': ['exact'],
            'latitude': ['range'],
            'longitude': ['range'],
        }
    