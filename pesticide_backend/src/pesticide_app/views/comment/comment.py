from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated 
from rest_framework.authentication import TokenAuthentication
from pesticide_app.api.serializers import CommentSerializer
from pesticide_app.permissions import  CommentorPermissions, AdminOrReadOnlyPermisions
from pesticide_app.models import Comment

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
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
