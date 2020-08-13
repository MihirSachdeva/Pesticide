from django.core.mail import send_mail
from django.conf import settings


def new_issue_reported(project_name, project_page_link, reported_by, issue_title, project_members=[]):
    """
    Send email to notify members of a project that a new issue has been reported in their project. \n
    Takes args(project_name, project_page_link, reported_by, issue_title, project_members=[])
    """

    for member in project_members:
        if member.email_subscriptions.all()[0].on_new_issue:
            name = member.name
            email = member.email

            text = f"""
                        Hi, {name}!
                        {reported_by} has reported a new issue in the project {project_name}:

                        {issue_title}
                        Bon Testing!
                        The Pesticide Bot
                    """

            html = f"""
                        <html>
                            <head></head>
                            <body style="max-width:350px;">
                                    <h3>Hi, {name}!</h3>
                                    <div>{reported_by} has reported a new issue in the project <b>{project_name}</b>:<div>
                                    <br>
                                    
                                    <b>{issue_title}</b>
                                    <br>
                                    <center>
                                        <div style="margin-top:30px; border-radius:5px; border-width:0px; text-align:center; background:#5390d9; width:50%; height:fit-content; padding:13px; display: table;">
                                            <center>
                                                <div style="display:table-cell; vertical-align:middle;"> 
                                                    <a style="color:white; font-size:16px;" href="{project_page_link}">Check it out!</a>
                                                </div>
                                            </center>
                                        </div>
                                    </center>
                                    <br>
                                    Bon Testing!<br>
                                    The Pesticide Bot<br>
                            </body>
                        </html>
                    """

            send_mail(
                subject=f"[PESTICIDE] New Issue in {project_name}",
                message=text,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email, ],
                html_message=html
            )
