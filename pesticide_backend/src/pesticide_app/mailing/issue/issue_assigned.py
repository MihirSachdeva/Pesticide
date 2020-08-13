from django.core.mail import send_mail
from django.conf import settings


def issue_assigned(project_name, project_page_link, issue_title, assigned_to, assigned_by):
    """
    Send email to notify user that an issue has been assigned to them. \n
    Takes args(project_name, project_page_link, issue_title, assigned_to, assigned_by)
    """
    if assigned_to.email_subscriptions.all()[0].on_issue_assign:
        text = f"""
                    Hi, {assigned_to.name}!
                    You have been assigned an issue in the project {project_name} by {assigned_by.name}.
                    The title of the issue is:
                    {issue_title}
                    Bon Testing!
                    The Pesticide Bot
                """

        html = f"""
                    <html>
                        <head></head>
                        <body style="max-width:350px;">
                                <h3>Hi, {assigned_to.name}!</h3>
                                <div>You have been assigned an issue in the project <b>{project_name}</b> by {assigned_by.name}.<div>
                                
                                <br>
                                <div>The title of the issue is:</div><br>
                                <b>{issue_title}</b>
                                <br>
                                <center>
                                    <div style="margin-top:30px; border-radius:5px; border-width:0px; text-align:center; background:#5390d9; width:50%; height:fit-content; padding:13px; display: table;">
                                        <center>
                                            <div style="display:table-cell; vertical-align:middle;"> 
                                                <a style="color:white; font-size:16px;" href="{project_page_link}">Go to project</a>
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
            subject=f"[PESTICIDE] New issue assigned to you in {project_name}",
            message=text,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[assigned_to.email, ],
            html_message=html
        )
