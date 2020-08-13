from django.core.mail import send_mail
from django.conf import settings


def new_comment(project_name, project_page_link, issue_title, issue_reporter_name, comment, commentor_name, issue_reporter, issue_assignee, project_members=[]):
    """
    Send email to notify members of the project, reporter of the issue and issue assignee that a new comment
    has been added in the concerning issue. \n
    Takes args(project_name, project_page_link, issue_title, issue_reporter_name, comment, commentor_name, issue_reporter, issue_assignee project_members=[])
    """

    for member in project_members:
        if member.email_subscriptions.all()[0].on_new_comment:

            name = member.name
            email = member.email

            text = f"""
                        Hi, {name}!
                        {commentor_name} just added a new comment in the issue:
                        {issue_title} (issue reported by {issue_reporter_name})

                        The comment says:
                        {comment}
                        In the project: {project_name}
                        Bon Testing!
                        The Pesticide Bot
                    """

            html = f"""
                        <html>
                            <head></head>
                            <body style="max-width:350px;">
                                    <h3>Hi, {name}!</h3>

                                    <div>{commentor_name} just added a new comment in the issue:</div>
                                    <div>{issue_title} (issue reported by {issue_reporter_name})</div>

                                    <div>The comment says:</div>
                                    <div>{comment}</div>
                                    <div>In the project: {project_name}</div>

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

            send_mail(
                subject=f"[PESTICIDE] New Comment by {commentor_name} in issue '{issue_title}' ({project_name})",
                message=text,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email, ],
                html_message=html
            )

    if issue_reporter.email_subscriptions.all()[0].on_new_comment:
        name = issue_reporter.name
        email = issue_reporter.email

        text = f"""
                    Hi, {name}!
                    {commentor_name} just added a new comment in the issue:
                    {issue_title} (issue reported by {issue_reporter_name})

                    The comment says:
                    {comment}
                    In the project: {project_name}
                    Bon Testing!
                    The Pesticide Bot
                """

        html = f"""
                    <html>
                        <head></head>
                        <body style="max-width:350px;">
                                <h3>Hi, {name}!</h3>
                
                                <div>{commentor_name} just added a new comment in the issue:</div>
                                <div>{issue_title} (issue reported by {issue_reporter_name})</div>

                                <div>The comment says:</div>
                                <div>{comment}</div>
                                <div>In the project: {project_name}</div>

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

        send_mail(
            subject=f"[PESTICIDE] New Comment by {commentor_name} in issue '{issue_title}' ({project_name})",
            message=text,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[issue_reporter.email, ],
            html_message=html
        )

    if issue_assignee != None & issue_assignee.email_subscriptions.all()[0].on_new_comment:
        name = issue_assignee.name
        email = issue_assignee.email

        text = f"""
                    Hi, {name}!
                    {commentor_name} just added a new comment in the issue:
                    {issue_title} (issue reported by {issue_reporter_name})

                    The comment says:
                    {comment}
                    In the project: {project_name}
                    Bon Testing!
                    The Pesticide Bot
                """

        html = f"""
                    <html>
                        <head></head>
                        <body style="max-width:350px;">
                                <h3>Hi, {name}!</h3>
                
                                <div>{commentor_name} just added a new comment in the issue:</div>
                                <div>{issue_title} (issue reported by {issue_reporter_name})</div>

                                <div>The comment says:</div>
                                <div>{comment}</div>
                                <div>In the project: {project_name}</div>

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

        send_mail(
            subject=f"[PESTICIDE] New Comment by {commentor_name} in issue '{issue_title}' ({project_name})",
            message=text,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[issue_assignee.email, ],
            html_message=html
        )
