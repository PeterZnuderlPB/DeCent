from django.db import models
from django.conf import settings
from datetime import datetime
from django_currentuser.middleware import get_current_authenticated_user # pip install django-currentuser => gets current user
# Create your models here.

class PBModel(models.Model):
    user_created = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="UserCreated", on_delete=models.CASCADE, blank=True)
    date_created = models.DateTimeField(auto_now_add=True)
    user_last_modified = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="UserLastModified", on_delete=models.CASCADE, blank=True)
    date_last_modified = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField()
    is_locked = models.BooleanField()

    def delete(self):
        self.is_active=False
        self.save()
    
    def save(self, *args, **kwargs):
        self.date_last_modified=datetime.utcnow()
        self.user_last_modified=get_current_authenticated_user()
        if(not self.user_created_id):
            self.user_created = get_current_authenticated_user()
        super(PBModel, self).save(*args, **kwargs)