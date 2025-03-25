from django.contrib.contenttypes.fields import GenericRelation
from django.db import models
from django.contrib.auth.models import User


class Post(models.Model):
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )
    title = models.CharField(max_length=255)
    body = models.TextField(blank=True)
    listing_type = models.IntegerField(
        choices=[
            (0, 'Draft'),
            (1, 'Private'),
            (2, 'Unlisted'),
            (3, 'Public')
        ], default=0
    )
    original_post = models.ForeignKey(
        'Post',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='reposts'
    )
    reactions = GenericRelation(
        'reactions.Reaction',
        related_query_name='post'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.id}: {self.title}"