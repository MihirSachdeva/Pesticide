from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated 
from rest_framework.authentication import TokenAuthentication
from django_filters.rest_framework import DjangoFilterBackend
from pesticide_app.api.serializers import ProjectSerializer
from pesticide_app.permissions import  ProjectCreatorMembersPermissions, AdminOrReadOnlyPermisions
from pesticide_app.models import Project

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    queryset = Project.objects.all()
    permission_classes = [IsAuthenticated & (ProjectCreatorMembersPermissions | AdminOrReadOnlyPermisions)]
    authentication_classes = [TokenAuthentication, ]
    filter_backends = [DjangoFilterBackend, ]
    filterset_fields = ['members']

    def create(self, request, *args, **kwargs):
        project = request.data
        project['creator'] = request.user.id
        serializer = ProjectSerializer(data=project)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
