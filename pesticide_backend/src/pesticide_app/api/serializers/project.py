from rest_framework import serializers
from pesticide_app.models import Project, ProjectIcon
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
