from django.contrib.contenttypes.fields import GenericRelation
from django.db import models
from django.contrib.auth.models import User
from comments.models import Comment


class CommentReply(models.Model):
    """
    Model for replies to a comment.
    """
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='comment_replies'
    )
    target = models.ForeignKey(
        Comment,
        on_delete=models.CASCADE,
        related_name='replies'
    )
    body = models.TextField()
    reactions = GenericRelation(
        'reactions.Reaction',
        related_query_name='comment_reply'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.id}: {self.body}'