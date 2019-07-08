from django.db import models
from django.contrib.auth.models import AbstractUser


# Do not reference UserModel directly. Use from django.contrib.auth import get_user_model 
# or for foreign key use the following:
# from django.conf import settings
# model = settings.AUTH_USER_MODEL

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    biography = models.TextField(default="")
    pass
