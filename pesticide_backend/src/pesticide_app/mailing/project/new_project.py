from django.core.mail import send_mail
from django.conf import settings


def new_project_added(project_name, project_link, project_page_link, users=[]):
    """
    Send email to notify all users (members of IMG) that a new project has been added in Pesticide. \n
    Takes args(project_name, project_link, project_page_link, users=[])
    """

    for member in users:
        if assigned_to.email_subscriptions.all()[0].on_new_project:
            name = member.name
            email = member.email

            text = f"""
                        Hi, {name}!
                        A new project, {project_name} has been added to The Pesticide App.
                        Bon Testing!
                        The Pesticide Bot
                    """

            html = f"""
                        <html>
                            <head></head>
                            <body style="max-width:350px;">
                                    <h3>Hi, {name}!</h3>
                    
                                    <div>A new project, <b>{project_name}</b>has been added to The Pesticide App.<div>
                    
                                    <center>
                                        <div style="margin-top:30px; border-radius:5px; border-width:0px; text-align:center; background:#5390d9; width:50%; height:fit-content; padding:13px; display: table;">
                                            <center>
                                                <div style="display:table-cell; vertical-align:middle;"> 
                                                    <a style="color:white; font-size:16px;" href="{project_page_link}">Go to Project Page</a>
                                                </div>
                                            </center>
                                        </div>
                                    </center>
                                    <br>
                                    <center>
                                        <div style="margin-top:30px; border-radius:5px; border-width:0px; text-align:center; background:#5390d9; width:50%; height:fit-content; padding:13px; display: table;">
                                            <center>
                                                <div style="display:table-cell; vertical-align:middle;"> 
                                                    <a style="color:white; font-size:16px;" href="{project_link}">Checkout The Project</a>
                                                </div>
                                            </center>
                                        </div>
                                    </center>
                                    <br>
                                    <br>
                                    Bon Testing!<br>
                                    The Pesticide Bot<br>
                            </body>
                        </html>
                    """

            send_mail(
                subject=f"[PESTICIDE] New Project: {project_name}",
                message=text,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email, ],
                html_message=html
            )
