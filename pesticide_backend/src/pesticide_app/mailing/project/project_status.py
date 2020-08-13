from django.core.mail import send_mail
from django.conf import settings


def project_status_update(project_name, project_link, project_page_link, old_status, new_status, changed_by_name, users=[]):
    """
    Send email to notify all users that a project's status has been changed. \n
    Takes args(project_name, project_link, project_page_link, old_status, new_status, users=[])
    """

    for member in users:
        if member.email_subscriptions.all()[0].on_project_status_change:
            name = member.name
            email = member.email

            text = f"""
                        Hi, {name}!
                        The status of {project_name} has been changed from {old_status} to {new_status} by {changed_by_name}!
                        Bon Testing!
                        The Pesticide Bot
                    """

            html = f"""
                <html>
                    <head></head>
                    <body style="max-width:350px;">
                            <h3>Hi, {name}!</h3>
            
                            <div>The status of {project_name} has been changed from {old_status} to <b>{new_status}</b> by <b>{changed_by_name}</b>!<div>
            
                            <center>
                                <div style="margin-top:30px; border-radius:5px; border-width:0px; text-align:center; background:#5390d9; width:50%; height:fit-content; padding:13px; display: table;">
                                    <center>
                                        <div style="display:table-cell; vertical-align:middle;"> 
                                            <a style="color:white; font-size:16px;" href="{project_page_link}">Go to Project Page</a>
                                        </div>
                                    </center>
                                </div>
                            </center>
                            <center>
                                <div style="margin-top:30px; border-radius:5px; border-width:0px; text-align:center; background:#5390d9; width:50%; height:fit-content; padding:13px; display: table;">
                                    <center>
                                        <div style="display:table-cell; vertical-align:middle;"> 
                                            <a style="color:white; font-size:16px;" href="{project_link}">Go to Project</a>
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

            send_mail(
                subject=f"[PESTICIDE] {project_name}'s status has been changed to {new_status}.",
                message=text,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email, ],
                html_message=html,
                fail_silently=False
            )
