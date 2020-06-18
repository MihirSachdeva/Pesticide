from rest_framework import permissions
from pesticide_app.models import *

class CommentorPermissions(permissions.BasePermission):
    """
    Allow access to comment creator, safe and post access to other members.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS or request.method == 'POST':
            return True

        return obj.commentor == request.user


class IssueCreatorPermissions(permissions.BasePermission):
    """
    Allow delete access to issue reporter, safe and post access to other members.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS or request.method == 'POST':
            return True
        elif request.method in permissions.SAFE_METHODS or request.method == 'DELETE':
            return obj.reporter == request.user
        else:
            return False


class ProjectCreatorMembersPermissions(permissions.BasePermission):
    """
    Allow access to project creator and members, safe and post access to other members.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS or request.method == 'POST':
            return True

        return obj.creator == request.user or request.user in obj.members.all()


class ImageProjectCreatorMembersPermissions(permissions.BasePermission):
    """
    Allow access to project (of whose the icon is being changed) creator and members, safe and post access to other members.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS or request.method == 'POST':
            return True

        return obj.project.creator == request.user or request.user in obj.project.members.all()



class AdminOrReadOnlyPermisions(permissions.BasePermission):
    """
    Allow access to admins, safe and put access to other members.
    """
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return request.user.is_master


class AdminOrSafeMethodsPostPermissions(permissions.BasePermission):
    """
    Allow access to admins, safe and put access to other members.
    """
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS or request.method == 'POST':
            return True

        return request.user.is_master


class ReadOnlyPermissions(permissions.BasePermission):
    """
    Allow read access.
    """
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True


# class ProjectMemberOrReadOnlyPermissions(permissions.BasePermission):
#     """
#     Allow access to project members. 
#     """

#     def has_object_permission(self, request, view, obj):
#         if request.method in permissions.SAFE_METHODS:
#             return True

#         return obj.project_member_related == request.user
    
    
class IssueProjectCreatorOrMembers(permissions.BasePermission):
    """
    Allow issue edit access to issue's project members. 
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS or request.method == 'PATCH':
            return request.user in obj.project.members.all() or obj.project.creator == request.user

        return False