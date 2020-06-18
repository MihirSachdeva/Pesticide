from django.db import models
from djrichtextfield.models import RichTextField
from pesticide_app.models.user import User
from pesticide_app.models.project import Project
from pesticide_app.models.tag import Tag

def upload_path(instance, filename):
    return '/'.join(['issue_images', filename])

class Issue(models.Model):
    IssueStatusChoices = [
        ('Open', 'Open'), 
        ('Fixed', 'Fixed'), 
        ('Not_a_bug', 'Not_a_bug'), 
        ('Needs_more_information', 'Needs_more_information'), 
        ('Unclear', 'Unclear'),
        ('Closed', 'Closed'),
    ]

    title = models.CharField(max_length=50)
    description = RichTextField(blank=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    reporter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='issue_creator')
    tags = models.ManyToManyField(Tag, default='Bug')
    status = models.CharField(max_length=50, choices=IssueStatusChoices, default="Open")
    assigned_to = models.ForeignKey(User, blank=True, null=True, related_name='issue_asignee', on_delete=models.SET_NULL)
    timestamp = models.DateTimeField()

    def __str__(self):
        return "%s - %s - %s" % (self.title, self.project, self.status)
    
    
    class Meta:
        ordering = ['-timestamp']