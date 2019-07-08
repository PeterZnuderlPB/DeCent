from django.db import models
from django.conf import settings
# Create your models here.

class Post(models.Model):
    title = models.CharField(max_length = 100)
    content = models.TextField()
    date_published = models.DateField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL,related_name="posts", on_delete=models.CASCADE)

    def __str__(self):
        return "%s - %s Writen by %s %s on %s" % (self.title, self.content, self.author.first_name, self.author.last_name, self.date_published)
    
    __repr__=__str__