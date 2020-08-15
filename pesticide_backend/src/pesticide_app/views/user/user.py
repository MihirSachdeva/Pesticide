from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import BasicAuthentication, TokenAuthentication
from django.contrib.auth import login, logout
from django.contrib.auth.hashers import make_password
from datetime import timedelta
from django.utils import timezone
from django.conf import settings
import requests
from pesticide_app.api.serializers import UserSerializer
from pesticide_app.models import User, EmailSubscription
from pesticide_app.permissions import AdminOrReadOnlyPermisions, ReadOnlyPermissions
from pesticide_app.auth import CsrfExemptSessionAuthentication
from pesticide.settings import BASE_CONFIGURATION

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated & AdminOrReadOnlyPermisions]
    authentication_classes = [TokenAuthentication, ]

    @action(
        methods=['POST',], 
        detail=False, 
        url_name='onlogin', 
        url_path='onlogin', 
        permission_classes = [AllowAny],
        authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)
    )
    def on_login(self, request):
        client_id = BASE_CONFIGURATION["keys"]["client_id"]
        client_secret = BASE_CONFIGURATION["keys"]["client_secret"]
        # desired_state = BASE_CONFIGURATION["keys"]["desired_state"]

        try:
            authorization_code = self.request.data['code']
        except KeyError:
            return Response(
                {'message': 'No access token was provided in the request.'},
                status = status.HTTP_400_BAD_REQUEST
            )

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

            is_imgian = True # Remove this line to allow only members of IMG to use the app.
            
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


                new_user = User(
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

                new_user.is_staff = True
                new_user.is_admin = True
                new_user.save()

                email_subscriptions = EmailSubscription(
                    user = new_user
                )
                email_subscriptions.save()

                login(request=request, user=new_user)
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
        