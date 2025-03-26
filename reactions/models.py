from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from posts.models import Post
from comments.models import Comment
from django.db.models import Q


class Reaction(models.Model):
    """
    Model for reactions to posts and comments
    """
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )
    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE
    )
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey(
        'content_type',
        'object_id'
    )
    reaction = models.IntegerField(
        choices=[
            (0, 'Like'),
            (1, 'Love'),
            (2, 'Funny'),
            (3, 'Amazing'),
            (4, 'Care'),
            (5, 'Sad'),
            (6, 'Dislike'),
            (7, 'Angry')
        ]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['owner', 'content_type', 'object_id']

    def __str__(self):
        return f"{self.owner} reacted to {self.content_object}"
    
    @property
    def reaction_to(self):
        return f'{self.content_type.model.capitalize()}: {self.content_object.__str__()}'