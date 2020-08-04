from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated 
from rest_framework.authentication import TokenAuthentication
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from pesticide_app.pagination import StandardResultsSetPagination
from pesticide_app.api.serializers import IssueSerializer
from pesticide_app.permissions import  IssueCreatorPermissions, IssueProjectCreatorOrMembers, AdminOrReadOnlyPermisions
from pesticide_app.models import Issue

class IssueViewSet(viewsets.ModelViewSet):
    serializer_class = IssueSerializer
    queryset = Issue.objects.all()
    permission_classes = [IsAuthenticated & (IssueCreatorPermissions | IssueProjectCreatorOrMembers | AdminOrReadOnlyPermisions)]
    authentication_classes = [TokenAuthentication, ]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, ]
    filterset_fields = ['project', 'reporter', 'assigned_to', 'tags']

    def create(self, request, *args, **kwargs):
        issue = request.data
        issue['reporter'] = request.user.id
        serializer = IssueSerializer(data=issue)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
