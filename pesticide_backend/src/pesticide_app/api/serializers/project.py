from django.core.serializers import serialize
from rest_framework import serializers
from pesticide_app.models import Project, ProjectIcon, User
from slugify import slugify

class ProjectIconSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectIcon
        fields = '__all__'

class ProjectNameSlugSerializer(serializers.ModelSerializer):
    projectslug = serializers.SerializerMethodField('projectSlug')

    def projectSlug(self, obj):
        return slugify(obj.name)

    class Meta:
        model = Project
        fields = ['id', 'name', 'projectslug']

class ProjectSerializer(serializers.ModelSerializer):
    icon = ProjectIconSerializer(source='projecticon_set', many=True, read_only=True)
    projectslug = serializers.SerializerMethodField('projectSlug')

    def projectSlug(self, obj):
        return slugify(obj.name) 

    class Meta:
        model = Project
        fields = '__all__'

class ProjectMembersSerializer(serializers.ModelSerializer):
    project_members = serializers.SerializerMethodField('members')
    other_users = serializers.SerializerMethodField('others')

    def members(self, obj):
        member_list = []
        for user in list(obj.members.all()):
            data = {
                'id': user.id,
                'name': user.name,
                'enrollment_number': user.enrollment_number,
                'display_picture': user.display_picture
            }
            member_list.append(data)
        return member_list

    def others(self, obj):
        allUsers = set(User.objects.all())
        projectMembers = set(obj.members.all())
        otherUsers = list(allUsers.difference(projectMembers))
        other_users_list = []
        for user in otherUsers:
            data = {
                'id': user.id,
                'name': user.name,
                'enrollment_number': user.enrollment_number,
                'display_picture': user.display_picture
            }
            other_users_list.append(data)
        return other_users_list

    class Meta:
        model = Project
        fields = ['id', 'project_members', 'other_users']
