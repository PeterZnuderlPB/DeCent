from django.db import models
from django.conf import settings

# Create your models here.

def setPath(self, filename):
    url = 'files/%s/%s/%s' % ('category', self.owner.id, filename) # TODO: Add category table => Replace 'category'
    return url

class File(models.Model):
    name = models.CharField(max_length = 100)
    file = models.FileField(upload_to=setPath)
    upload_date = models.DateField()
    owner = models.ForeignKey(settings.AUTH_USER_MODEL,related_name="files", on_delete=models.CASCADE)

    def __str__(self):
        return "%s - Owned by %s %s . Uploaded on  %s" % (self.name,  self.owner.first_name, self.owner.last_name, self.upload_date)
    
    __repr__=__str__

    
    def delete(self, *args, **kwargs):
        #Before calling the super function delete all the files from storage, otherwise only the database instance will get deleted
        self.file.delete()
        super().delete(*args, **kwargs)