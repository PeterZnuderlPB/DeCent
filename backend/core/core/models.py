from django.db import models
from django.conf import settings
from datetime import date
from django_currentuser.middleware import get_current_authenticated_user # pip install django-currentuser => gets current user
# Create your models here.

class PBModel(models.Model):
    user_created = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="UserCreated", on_delete=models.CASCADE)
    date_created = models.DateField()
    user_last_modified = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="UserLastModified", on_delete=models.CASCADE)
    date_last_modified = models.DateField()
    is_active = models.BooleanField()
    is_locked = models.BooleanField()

    def delete(self):
        self.is_active=False
        self.save()
    
    def save(self, *args, **kwargs):
        self.date_last_modified=date.today()
        self.user_last_modified=get_current_authenticated_user()
        super(PBModel, self).save(*args, **kwargs)