from django.db import models
from django.db.models.signals import post_save
from django.contrib.auth.models import User
from taggit.managers import TaggableManager


class Profile(models.Model):
    owner = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.ImageField(
        upload_to='images/', default='../default_profile_oopuxr'
    )
    content = models.TextField(blank=True)
    account_type = models.IntegerField(
        choices=[
            (0, 'Social'),
            (1, 'Service Provider'),
            (2, 'Support Provider')
        ], default=0
    )
    verified = models.IntegerField(
        choices=[
            (0, 'Unverified'),
            (1, 'Requested'),
            (2, 'Rejected'),
            (3, 'Verified')
        ], default=0
    )
    interests = TaggableManager()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.owner}'s profile"
    
    @property
    def interests_list(self):
        """"
        Returns a list of interests for the profile.
        """
        interests = self.interests.all()
        if interests:
            return [interest.name for interest in interests]


def create_profile(sender, instance, created, **kwargs):
    if created:
        self = Profile.objects.create(
            owner=instance,
        )
        self.interests.add(f'@{instance.username.lower()}')


post_save.connect(create_profile, sender=User)