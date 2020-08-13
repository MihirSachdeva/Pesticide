import threading
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated 
from rest_framework.authentication import TokenAuthentication
from pesticide_app.api.serializers import CommentSerializer
from pesticide_app.permissions import  CommentorPermissions, AdminOrReadOnlyPermisions
from pesticide_app.models import Comment
from pesticide_app.mailing import new_comment
from slugify import slugify

class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()
    permission_classes = [IsAuthenticated & (CommentorPermissions | AdminOrReadOnlyPermisions)]
    authentication_classes = [TokenAuthentication, ]

    def create(self, request, *args, **kwargs):
        comment = request.data
        comment['commentor'] = request.user.id
        serializer = CommentSerializer(data=comment)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        comment = serializer.save()
        projectPageLink = "http://127.0.0.1:3000/projects/" + slugify(comment.issue.project.name) 
        email_notification = threading.Thread(
            target=new_comment, 
            args=(
                comment.issue.project.name, 
                projectPageLink, 
                comment.issue,
                comment.issue.reporter.name,
                comment.text,
                comment.commentor.name,
                comment.issue.reporter,
                comment.issue.assigned_to,
                comment.issue.project.members.all(),
            )
        )
        email_notification.start()

