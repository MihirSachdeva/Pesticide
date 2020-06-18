from django.db import models
from pesticide_app.models.project import Project

def upload_path(instance, filename):
    return '/'.join(['project_icons', filename])

class ProjectIcon(models.Model):
    image = models.ImageField(blank=True, null=True, upload_to=upload_path)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)

    def __str__(self):
        return "Icon - %s" % (self.project)