from rest_framework import serializers
from pesticide_app.models import User
from .issue import IssueSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        read_only_fields = ['enrollment_number']
        exclude = ['access_token', 'refresh_token', 'password']

class UsersIssueTallySerializer(serializers.ModelSerializer):
    issues = IssueSerializer(source='issue_creator', many=True, read_only=True)

    class Meta:
        model = User
        fields = ('id','enrollment_number', 'name','issues')