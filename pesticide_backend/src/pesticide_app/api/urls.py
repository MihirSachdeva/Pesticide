from django.urls import path
from rest_framework.routers import DefaultRouter
from pesticide_app.views import *

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='users')
router.register(r'userByEnrNo', UserByEnrNoViewSet, basename='userByEnrNo')
router.register(r'projects', ProjectViewSet, basename='projects')
router.register(r'issues', IssueViewSet, basename='issues')
router.register(r'comments', CommentViewSet, basename='comments')
router.register(r'tags', TagViewSet, basename='tags')
router.register(r'projectnameslug', ProjectNameSlugViewSet, basename='project_names_and_slugs')
router.register(r'projecticons', ProjectIconViewSet, basename='project_icons')
router.register(r'issueimages', IssueImageViewSet, basename='issue_images')
router.register(r'userissues', UsersIssueTallyViewSet, basename='user_issues')

urlpatterns = router.urls