from django.db import models
from django.contrib.auth.models import User
from posts.models import Post


class Comment(models.Model):
    """
    Model for comments on posts
    """
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    body = models.TextField()
    # is the best way to handle replies to comments just letting react select a
    # comment id that has the same post id?
    # then on the backend, we check that if a reply_to is not None, then we
    # check it is valid by checking the original comment's post id matches that
    # of the reply comment?
    reply_to = models.ForeignKey(
        'Comment',
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name='replies'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return {self.body}
    
    # def get_post_comments(self):
    #     return self.post.comments.all()


# class CommentReply(Comment):
#     """
#     Model for replies to comments
#     """
#     reply_to = models.ForeignKey(
#         Comment.objects.filter(post=post),
#         on_delete=models.CASCADE,
#         related_name='replies'
#     )

#     class Meta:
#         ordering = ['-created_at']

#     def __str__(self):
#         return {self.body}
    

    # models.ForeignKey(
    #     'self'.objects.filter(post=post),
    #     on_delete=models.CASCADE,
    #     blank=True,
    #     null=True,
    #     related_name='replies'
    # )