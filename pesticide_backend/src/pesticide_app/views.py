from rest_framework import viewsets, status
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny 
from django.contrib.auth import login, logout
from django.contrib.auth.hashers import make_password
from django.http import HttpResponse
from datetime import timedelta
from django.utils import timezone
from django.conf import settings
from rest_framework.authtoken.models import Token
import requests
from pesticide_app.api.serializers import *
from pesticide_app.permissions import  *
from pesticide_app.models import *

from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication

class CsrfExemptSessionAuthentication(SessionAuthentication):

    def enforce_csrf(self, request):
        return  # To not perform the csrf check previously happening


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)

    # permission_classes = [IsAuthenticated, ]
    # lookup_field = 'enrollment_number'

    @action(methods=['POST', 'OPTIONS, PUT'], detail=False, url_name='onlogin', url_path='onlogin', permission_classes = [AllowAny])
    def on_login(self, request):
        client_id = 'gKUvZEAlIemSbCql1JzDkR2ClVBY6MjGehIyqeeY'
        client_secret = '2bcWZd3UvG38W4LoG0QCgEgSpoFfTWC6ObXCLemyn9NRobAMwJqKyN36iKVftP1XkKzJebkmj1FEfVDYLfN5FDvogpebaLqgckgfa9P7kWyxgTgBWtPC40j3Nh07FGAt'
        # desired_state = 'foobarbaz42'

        authorization_code = self.request.data['code']
        # recieved_state = self.request.data['state']

        # if (recieved_state != desired_state):
        #     return Response(
        #         data = 'Internal Server Error. Try Again later.', 
        #         status = status.HTTP_500_INTERNAL_SERVER_ERROR
        #     )

        url = 'https://internet.channeli.in/open_auth/token/'
        data = {
            'client_id': client_id,
            'client_secret': client_secret,
            'grant_type': 'authorization_code',
            'redirect_url': 'http://127.0.0.1:3000/onlogin',
            'code': authorization_code
        }
        token_data = requests.post(url=url, data=data).json()

        if ('error' in  token_data.keys()):
            return Response(
                data = token_data['error'], 
                status = status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        access_token = token_data['access_token']
        refresh_token = token_data['refresh_token']
        headers = {
            'Authorization': 'Bearer ' + access_token
        }
        user_data = requests.get(url='https://internet.channeli.in/open_auth/get_user_data/', headers=headers).json()
        print(user_data)
        # if (user_data.status_code != 200):
        #     return Response(
        #         data = user_data['detail'], 
        #         status = status.HTTP_500_INTERNAL_SERVER_ERROR
        #     )

        # def expires_in(access_token):
        #     time_elapsed = timezone.now() - access_token.created
        #     time_left = timedelta(seconds = settings.TOKEN_EXPIRED_AFTER_SECONDS) - time_elapsed
        #     return(time_left)

        # def is_token_expired(access_token):
        #     return expires_in(access_token) < timedelta(seconds = 0)

        # def token_expired_handler(access_token):
        #     is_expired = is_token_expired(access_token)

        # if is_expired:
        #     access_token.delete()

        #     url = 'https://internet.channeli.in/open_auth/token/'
        #     data = {
        #         'client_id': 'yW4AebldMW55KMs6xxX54DKd3KT2RvBgsognYmai',
        #         'client_secret': 'OvLyovuXnUhRxLvFfjzZqKhlw9s98CUpPCQc15xWZZf4XoUPnCtlEFTR1SQZCgWMj61Kfi6QWsETx9qSkdh2Q6uOt3o0NFoJ2N2ddecmsDEcGWJemWjZxiHruUIPnPWS',
        #         'grant_type': 'refresh_token',
        #         'refresh_token': refresh_token
        #     }
        #     user_data = requests.post(url=url, data=data).json()

        # access_token = user_data['access_token']
        # refresh_token = user_data['refresh_token']

        # headers = {
        #     'Authorization': 'Bearer ' + access_token
        # }
        # user_data = requests.get(url='https://internet.channeli.in/open_auth/get_user_data/', headers=headers).json()

        try: 
            existingUser = User.objects.get(enrollment_number=user_data['student']['enrolmentNumber'])
            print(existingUser)

        except User.DoesNotExist:
            is_imgian = False
            for role in user_data['person']['roles']:
                if 'Maintainer' in role.values():
                    is_imgian = True

            if not is_imgian:
                return Response(
                    data = 'This app is only accessible to members of IMG IIT Roorkee.',
                    status = status.HTTP_401_UNAUTHORIZED
                )

            else:
                is_master = False
                if user_data['student']['currentYear'] > 3:
                    is_master = True

                enrollment_number = user_data['student']['enrolmentNumber']
                email = user_data['contactInformation']['instituteWebmailAddress']
                full_name = user_data['person']['fullName']
                first_name = full_name.split()[0]
                current_year = user_data['student']['currentYear']
                branch_name = user_data['student']['branch name']
                degree_name = user_data['student']['branch degree name']
                if user_data['person']['displayPicture'] != None:
                    display_picture = 'http://internet.channeli.in' + user_data['person']['displayPicture']
                else: 
                    display_picture = ''
                is_master  = False
                if user_data['student']['currentYear'] > 3:
                    is_master = True


                newUser = User(
                    username = enrollment_number,
                    enrollment_number = enrollment_number,
                    email = email,
                    name = full_name,
                    first_name = first_name,
                    is_master = is_master,
                    access_token = access_token,
                    refresh_token = refresh_token,
                    current_year = current_year,
                    branch = branch_name,
                    degree = degree_name,
                    is_active = True,
                    display_picture = display_picture,
                    password = make_password(access_token)
                )

                newUser.is_staff = True
                newUser.is_admin = True
                newUser.save()
                login(request=request, user=newUser)
                return Response(
                    {'status': 'Acount created successfully. Welcome to Pesticide.', 'username': enrollment_number, 'access_token': access_token},
                    status = status.HTTP_202_ACCEPTED
                )


        current_year = user_data['student']['currentYear']
        branch_name = user_data['student']['branch name']
        degree_name = user_data['student']['branch degree name']
        if user_data['person']['displayPicture'] != None:
            display_picture = 'http://internet.channeli.in' + user_data['person']['displayPicture']
        else: 
            display_picture = ''
        is_master  = False
        if user_data['student']['currentYear'] > 3:
            is_master = True


        existingUser.is_master = is_master
        existingUser.current_year = current_year
        existingUser.branch = branch_name
        existingUser.degree = degree_name
        existingUser.display_picture = display_picture
        
        if existingUser.access_token != access_token:
            existingUser.access_token = access_token
            existingUser.refresh_token = refresh_token
            # try:
            existingUser.set_password(access_token)
            # except:
            #     print("Couldn't change password.")
            existingUser.save()

        login(request=request, user=existingUser)

        return Response(
            {'status': 'Logged in! Welcome to Pesticide!', 'username': existingUser.enrollment_number, 'access_token': access_token},
            status = status.HTTP_202_ACCEPTED
        )



    # @action(methods=['post', 'options', ], detail=False, url_name="login", url_path="login", permission_classes=[AllowAny])
    # def pre_login(self, request):
    #     # print({"hello":"o"})
    #     data = self.request.data
    #     token = data["access_token"]

    #     try:
    #         user = User.objects.get(access_token=token)
    #     except User.DoesNotExist:
    #         return Response({"status": "user does not exist in database"})

    #     # LOGIN
    #     login(request=request, user=user)
    #     # request.session["user"] = user
    #     return Response({"status": "user found"}, status=status.HTTP_202_ACCEPTED)



    # @action(methods=['get', 'options', ], detail=False, url_name="test", url_path="test", permission_classes=[AllowAny])
    # def test(self, request):
    #     if request.user.is_authenticated:
    #         return Response({"detail": request.user.enrolment_number}, status=status.HTTP_202_ACCEPTED)
    #     else:
    #         return Response({"detail": "Not authenticated"})



##########


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    queryset = Project.objects.all()
    permission_classes = [IsAuthenticated & (ProjectCreatorMembersPermissions | AdminOrReadOnlyPermisions)]
    authentication_classes = [TokenAuthentication, ]

    def create(self, request, *args, **kwargs):
        project = request.data
        project['creator'] = request.user.id
        serializer = ProjectSerializer(data=project)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


##########


class ProjectIconViewSet(viewsets.ModelViewSet):
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = ProjectIconSerializer
    queryset = ProjectIcon.objects.all()
    permission_classes = [IsAuthenticated & (ImageProjectCreatorMembersPermissions | AdminOrSafeMethodsPostPermissions)]
    authentication_classes = [TokenAuthentication, ]



##########


class ProjectNameSlugViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectNameSlugSerializer
    queryset = Project.objects.all()    
    permission_classes = [IsAuthenticated & ReadOnlyPermissions]
    authentication_classes = [TokenAuthentication, ]



##########


class IssueViewSet(viewsets.ModelViewSet):
    serializer_class = IssueSerializer
    queryset = Issue.objects.all()
    permission_classes = [IsAuthenticated & (IssueCreatorPermissions | IssueProjectCreatorOrMembers | AdminOrReadOnlyPermisions)]
    authentication_classes = [TokenAuthentication, ]

    def create(self, request, *args, **kwargs):
        issue = request.data
        issue['reporter'] = request.user.id
        serializer = IssueSerializer(data=issue)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



##########



class IssueImageViewSet(viewsets.ModelViewSet):
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = IssueImageSerializer
    queryset = IssueImage.objects.all()
    permission_classes = [IsAuthenticated & AdminOrSafeMethodsPostPermissions]
    authentication_classes = [TokenAuthentication, ]



##########



class TagViewSet(viewsets.ModelViewSet):
    serializer_class = TagSerializer
    queryset = Tag.objects.all()
    permission_classes = [IsAuthenticated & AdminOrReadOnlyPermisions]
    authentication_classes = [TokenAuthentication, ]



##########


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

##########


class UserByEnrNoViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated & ReadOnlyPermissions]
    authentication_classes = [TokenAuthentication, ]
    lookup_field = 'enrollment_number'


##########


class CustomObtainAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super(CustomObtainAuthToken, self).post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data['token'])
        return Response({'token': token.key, 'id': token.user_id})


##########


# class GetUserByToken(viewsets.ReadOnlyModelViewset):
#     serializer_class = UserSerializer
#     queryset = User.object.all()
#     def post(self, request):
#         try:
#             user = Token.objects.get(key=request.POST.get('token')).user
#         except:
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


##########

class UsersIssueTallyViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UsersIssueTallySerializer
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated & ReadOnlyPermissions]
    authentication_classes = [TokenAuthentication, ]