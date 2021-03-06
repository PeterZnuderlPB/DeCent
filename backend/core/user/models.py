from django.db import models
from django.contrib.auth.models import AbstractUser
from competency.models import Competency


# Do not reference UserModel directly. Use from django.contrib.auth import get_user_model 
# or for foreign key use the following:
# from django.conf import settings
# model = settings.AUTH_USER_MODEL

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    biography = models.TextField(default="")
    active_organization_id = models.IntegerField(blank=True, null=True)
    active_type = models.IntegerField(blank=True, null=True, default=1)
    active_cooperative = models.IntegerField(blank=True, null=True, default=0)
    competencys = models.ManyToManyField(Competency, blank=True)
    pass