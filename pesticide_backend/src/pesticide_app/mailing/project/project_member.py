from django.core.mail import send_mail
from django.conf import settings


def add_project_member(project_name, project_link, project_page_link, new_members=[]):
    """
    Send email to notify users that they have been added as a member in a project. \n
    Takes args(project_name, project_link, project_page_link, new_members=[])
    """

    for member in new_members:
        if member.email_subscriptions.all()[0].on_project_membership:
            name = member.name
            email = member.email

            text = f"""
                        Hi, {name}!
                        You have been added as a team member in the project {project_name}!
                        Bon Testing!
                        The Pesticide Bot
                    """

            html = f"""
                <html>
                    <head></head>
                    <body style="max-width:350px;">
                            <h3>Hi, {name}!</h3>
            
                            <div>You have been added as a team member in the project <b>{project_name}!</b>!<div>
            
                            <center>
                                <div style="margin-top:30px; border-radius:5px; border-width:0px; text-align:center; background:#5390d9; width:50%; height:fit-content; padding:13px; display: table;">
                                    <center>
                                        <div style="display:table-cell; vertical-align:middle;"> 
                                            <a style="color:white; font-size:16px;" href="{project_page_link}">Go to Project</a>
                                        </div>
                                    </center>
                                </div>
                            </center>
                            <br><br>
                            Bon Testing!<br>
                            The Pesticide Bot<br>
                    </body>
                </html>
                """

            # def sendMail(self, subject, from_user_name, to_user_name, receiver_email, text, html):
            send_mail(
                subject=f"[PESTICIDE] Project Membership: {project_name}",
                message=text,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email, ],
                html_message=html,
            )
