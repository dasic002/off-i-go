from django.db import models
from django.contrib.auth.models import User

from cloudinary_storage.storage import VideoMediaCloudinaryStorage


class Media(models.Model):
    """
    Model for media files
    """
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='media_files'
    )
    media_type = models.IntegerField(
        choices=[
            (0, 'Image'),
            (1, 'Video')
        ], default=0
    )
    image = models.ImageField(
        upload_to='images/',
        blank=True,
        null=True
    )
    video = models.FileField(
        upload_to='videos/',
        blank=True,
        null=True,
        storage=VideoMediaCloudinaryStorage()
    )
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        if self.media_type == 0:
            return f"{self.owner} uploaded {self.image.name}"
        elif self.media_type == 1:
            return f"{self.owner} uploaded {self.video.name}"
