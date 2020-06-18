from django.contrib import admin

from pesticide_app.models import User, Project, Issue, Comment, Tag, IssueImage, ProjectIcon

admin.site.register(User)
admin.site.register(Project)
admin.site.register(ProjectIcon)
admin.site.register(Issue)
admin.site.register(Comment)
admin.site.register(Tag)
admin.site.register(IssueImage)