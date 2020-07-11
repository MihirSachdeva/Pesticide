from rest_framework import serializers
from pesticide_app.models import *
from rest_auth.models import TokenModel

from slugify import slugify

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        read_only_fields = ['enrollment_number']
        exclude = ['access_token', 'refresh_token', 'password']


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'


class IssueImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = IssueImage
        fields = '__all__'

class IssueStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = IssueStatus
        fields = '__all__'

class IssueStatusTallySerializer(serializers.ModelSerializer):
    number_of_issues = serializers.SerializerMethodField('numberOfIssues')

    def numberOfIssues(self, obj):
        return len(obj.issue_set.all())

    class Meta:
        model = IssueStatus
        fields = '__all__'

class IssueSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(source='comment_set', many=True, read_only=True)
    image = IssueImageSerializer(source='issueimage_set', many=True, read_only=True)
    reporter_name = serializers.SerializerMethodField('reporterName')
    assigned_to_name = serializers.SerializerMethodField('asigneeName')
    project_name = serializers.SerializerMethodField('projectName')
    status_text = serializers.SerializerMethodField('statusText')
    status_color = serializers.SerializerMethodField('statusColor')
    status_type = serializers.SerializerMethodField('statusType')
    
    def reporterName(self, obj):
        return obj.reporter.name


    def projectName(self, obj):
        return obj.project.name


    def asigneeName(self, obj):
        if obj.assigned_to != None:
            return obj.assigned_to.name
        else:
            return None


    def statusText(self, obj):
        status_text = ""
        if obj.status != None:
            status_text = obj.status.status_text
        else:
            status_text = 'New'

        return status_text


    def statusColor(self, obj):
        status_color = ""
        if obj.status != None:
            status_color = obj.status.color
        else:
            status_color = "#217bf3"

        return status_color


    def statusType(self, obj):
        status_type = ""
        if obj.status != None:
            status_type = obj.status.type
        else:
            status_type = 'Pending'

        return status_type


    class Meta:
        model = Issue
        fields = '__all__'


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'


class ProjectIconSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectIcon
        fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):
    issues = IssueSerializer(source='issue_set', many=True, read_only=True)
    icon = ProjectIconSerializer(source='projecticon_set', many=True, read_only=True)
    projectslug = serializers.SerializerMethodField('projectSlug')

    def projectSlug(self, obj):
        return slugify(obj.name) 

    class Meta:
        model = Project
        fields = '__all__'


class ProjectNameSlugSerializer(serializers.ModelSerializer):
    projectslug = serializers.SerializerMethodField('projectSlug')

    def projectSlug(self, obj):
        return slugify(obj.name)

    class Meta:
        model = Project
        fields = ['id', 'name', 'projectslug']


class TokenSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)
    class Meta:
        model = TokenModel
        fields = ('key', 'user')   # there I add the `user` field ( this is my need data ).


class UsersIssueTallySerializer(serializers.ModelSerializer):
    issues = IssueSerializer(source='issue_creator', many=True, read_only=True)

    class Meta:
        model = User
        fields = ('id','enrollment_number', 'name','issues')