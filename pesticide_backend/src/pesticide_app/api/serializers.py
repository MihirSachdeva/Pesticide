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
    commentor_details = serializers.SerializerMethodField('commentorDetails')

    def commentorDetails(self, obj):
        details = {
            'id': obj.commentor.id,
            'name': obj.commentor.name,
            'enrollment_number': obj.commentor.enrollment_number,
            'display_picture': obj.commentor.display_picture
        }
        return details

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
    reporter_details = serializers.SerializerMethodField('reporterDetails')
    assignee_details = serializers.SerializerMethodField('assigneeDetails')
    project_name = serializers.SerializerMethodField('projectName')
    status_text = serializers.SerializerMethodField('statusText')
    status_color = serializers.SerializerMethodField('statusColor')
    status_type = serializers.SerializerMethodField('statusType')
    

    def reporterDetails(self, obj):
        details = {
            'id': obj.reporter.id,
            'name': obj.reporter.name,
            'enrollment_number': obj.reporter.enrollment_number,
            'display_picture': obj.reporter.display_picture
        }
        return details


    def projectName(self, obj):
        return obj.project.name


    def assigneeDetails(self, obj):
        details = {
            'id': obj.assigned_to.id,
            'name': obj.assigned_to.name,
            'enrollment_number': obj.assigned_to.enrollment_number,
            'display_picture': obj.assigned_to.display_picture
        }
        return details


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