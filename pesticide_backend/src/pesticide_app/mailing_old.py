from django.core.mail import send_mail
from django.conf import settings


class Mailer:
    def __init__(self):
        pass

    # def addProjectMember(self, project_name, project_link, project_page_link, members=[]):
    #     for member in members:
    #         name = member.full_name
    #         email = member.email

    #         text = f"""
    #                        Hi, {name}!
    #                        You have been added as a team member of the project {project_name}!
    #                        Bon Testing!
    #                        The Pesticide Bot
    #                """

    #         html = f"""
    #                <html>
    #                     <head></head>
    #                     <body style="max-width:350px;">
    #                             <h3>Hi, {name}!</h3>
                
    #                             <div>You have been added as a team member of the project <b>{project_name}!</b>!<div>
                
    #                             <center>
    #                                 <div style="margin-top:30px; border-radius:5px; border-width:0px; text-align:center; background:#5390d9; width:50%; height:fit-content; padding:13px; display: table;">
    #                                     <center>
    #                                         <div style="display:table-cell; vertical-align:middle;"> 
    #                                             <a style="color:white; font-size:16px;" href="{project_page_link}">Go to Project</a>
    #                                         </div>
    #                                     </center>
    #                                 </div>
    #                             </center>
    #                             <br><br>
    #                             Bon Testing!<br>
    #                             The Pesticide Bot<br>
    #                     </body>
    #                 </html>
    #            """

    #         # def sendMail(self, subject, from_user_name, to_user_name, receiver_email, text, html):
    #         send_mail(
    #             subject=f"[PESTICIDE] Project Membership: {project_name}",
    #             message=text,
    #             from_email=settings.EMAIL_HOST_USER,
    #             recipient_list=[email, ],
    #             html_message=html
    #         )

    # def newProject(self, project_name, project_link, project_page_link, imgians=[]):
    #     for member in imgians:
    #         name = member.name
    #         email = member.email

    #         text = f"""
    #                        Hi, {name}!
    #                        A new project, {project_name} has been added to The Pesticide App.
    #                        Bon Testing!
    #                        The Pesticide Bot
    #                """

    #         html = f"""
    #                <html>
    #                     <head></head>
    #                     <body style="max-width:350px;">
    #                             <h3>Hi, {name}!</h3>
                
    #                             <div>A new project, <b>{project_name}</b>has been added to The Pesticide App.<div>
                
    #                             <center>
    #                                 <div style="margin-top:30px; border-radius:5px; border-width:0px; text-align:center; background:#5390d9; width:50%; height:fit-content; padding:13px; display: table;">
    #                                     <center>
    #                                         <div style="display:table-cell; vertical-align:middle;"> 
    #                                             <a style="color:white; font-size:16px;" href="{project_page_link}">Go to Project Page</a>
    #                                         </div>
    #                                     </center>
    #                                 </div>
    #                             </center>
    #                             <br>
    #                             <center>
    #                                 <div style="margin-top:30px; border-radius:5px; border-width:0px; text-align:center; background:#5390d9; width:50%; height:fit-content; padding:13px; display: table;">
    #                                     <center>
    #                                         <div style="display:table-cell; vertical-align:middle;"> 
    #                                             <a style="color:white; font-size:16px;" href="{project_link}">Checkout The Project</a>
    #                                         </div>
    #                                     </center>
    #                                 </div>
    #                             </center>
    #                             <br>
    #                             <br>
    #                             Bon Testing!<br>
    #                             The Pesticide Bot<br>
    #                     </body>
    #                 </html>
    #            """

    #         # def sendMail(self, subject, from_user_name, to_user_name, receiver_email, text, html):
    #         send_mail(
    #             subject=f"[PESTICIDE] New Project: {project_name}",
    #             message=text,
    #             from_email=settings.EMAIL_HOST_USER,
    #             recipient_list=[email, ],
    #             html_message=html
    #         )

    # def newIssueReported(self, project_name, project_page_link, reported_by, issue_subject, project_members=[]):
    #     for member in project_members:
    #         name = member.name
    #         email = member.email

    #         text = f"""
    #                         Hi, {name}!
    #                         {reported_by} has reported a new issue in the project {project_name}:
 
    #                         {issue_subject}
    #                         Bon Testing!
    #                         The Pesticide Bot
    #                """

    #         html = f"""
    #                <html>
    #                     <head></head>
    #                     <body style="max-width:350px;">
    #                             <h3>Hi, {name}!</h3>
    #                             <div>{reported_by} has reported a new issue in the project <b>{project_name}</b>:<div>
    #                             <br>
                                
    #                             <b>{issue_subject}</b>
    #                             <br>
    #                             <center>
    #                                 <div style="margin-top:30px; border-radius:5px; border-width:0px; text-align:center; background:#5390d9; width:50%; height:fit-content; padding:13px; display: table;">
    #                                     <center>
    #                                         <div style="display:table-cell; vertical-align:middle;"> 
    #                                             <a style="color:white; font-size:16px;" href="{project_page_link}">Check it out!</a>
    #                                         </div>
    #                                     </center>
    #                                 </div>
    #                             </center>
    #                             <br>
    #                             Bon Testing!<br>
    #                             The Pesticide Bot<br>
    #                     </body>
    #                 </html>
    #            """

    #         # def sendMail(self, subject, from_user_name, to_user_name, receiver_email, text, html):
    #         send_mail(
    #             subject=f"[PESTICIDE] New Issue in {project_name}",
    #             message=text,
    #             from_email=settings.EMAIL_HOST_USER,
    #             recipient_list=[email, ],
    #             html_message=html
    #         )

    # def issueAssigned(self, project_name, assignment_link, issue_subject, assigned_to_name, assigned_to_email):

    #     text = f"""
    #                     Hi, {assigned_to_name}!
    #                     You have been assigned an issue for the project {project_name}.
    #                     Issue:
    #                     {issue_subject}
    #                     Bon Testing!
    #                     The Pesticide Bot
    #            """

    #     html = f"""
    #            <html>
    #                 <head></head>
    #                 <body style="max-width:350px;">
    #                         <h3>Hi, {assigned_to_name}!</h3>
    #                         <div>You have been assigned an issue for the project <b>{project_name}</b>.<div>
                            
    #                         <br>
    #                         <b>Issue:</b><br>
    #                         <b>{issue_subject}</b>
    #                         <br>
    #                         <center>
    #                             <div style="margin-top:30px; border-radius:5px; border-width:0px; text-align:center; background:#5390d9; width:50%; height:fit-content; padding:13px; display: table;">
    #                                 <center>
    #                                     <div style="display:table-cell; vertical-align:middle;"> 
    #                                         <a style="color:white; font-size:16px;" href="{assignment_link}">Check it out!</a>
    #                                     </div>
    #                                 </center>
    #                             </div>
    #                         </center>
    #                         <br><br>
    #                         Bon Testing!<br>
    #                         The Pesticide Bot<br>
    #                 </body>
    #             </html>
    #        """

    #     # def sendMail(self, subject, from_user_name, to_user_name, receiver_email, text, html):
    #     send_mail(
    #         subject=f"[PESTICIDE] New issue assigned in {project_name}",
    #         message=text,
    #         from_email=settings.EMAIL_HOST_USER,
    #         recipient_list=[assigned_to_email, ],
    #         html_message=html
    #     )

    # def bugResolved(self, project_name, project_link, resolved_by, issue_subject, team_members=[]):
    #     for mem in team_members:
    #         name = mem.full_name
    #         email = mem.email

    #         text = f"""
    #                         Hi, {name}!
    #                         {resolved_by} has resolved an issue for the project {project_name}:
    #                         Issue:
    #                         {issue_subject}
    #                         Bon Testing!
    #                         The Buggernaut Bot
    #                """

    #         html = f"""
    #                <html>
    #                     <head></head>
    #                     <body style="max-width:350px;">
    #                             <h3>Hi, {name}!</h3>
    #                             <div>{resolved_by} has resolved an issue for the project <b>{project_name}</b>:<div>
    #                             <br>
    #                             <b>Issue:</b><br>
    #                             <b>{issue_subject}</b>
    #                             <br>
    #                             <center>
    #                                 <div style="margin-top:30px; border-radius:5px; border-width:0px; text-align:center; background:#5390d9; width:50%; height:fit-content; padding:13px; display: table;">
    #                                     <center>
    #                                         <div style="display:table-cell; vertical-align:middle;">
    #                                             <a style="color:white; font-size:16px;" href="{project_link}">Go to Project</a>
    #                                         </div>
    #                                     </center>
    #                                 </div>
    #                             </center>
    #                             <br>
    #                             Bon Testing!<br>
    #                             The Buggernaut Bot<br>
    #                     </body>
    #                 </html>
    #            """

    #         # def sendMail(self, subject, from_user_name, to_user_name, receiver_email, text, html):
    #         send_mail(subject=f"Bug Resolved in {project_name}!", message=text, from_email="The Buggernaut Bot",
    #                   recipient_list=[email, ], html_message=html)

    # get user name from request.user and send who reopened the issue
    # def issueStatusUpdate(self, project_name, project_link, issue_subject, action, doer, project_members=[]):
    #     for members in project_members:
    #         name = member.full_name
    #         email = member.email

    #         text = f"""
    #                     Hi, {name}!
    #                     The following issue in the project {project_name} has been changed to {action} by {doer}:
    #                     {issue_subject}
    #                     Bon Testing!
    #                     The Pesticide Bot
    #                    """

    #         html = f"""
    #                    <html>
    #                         <head></head>
    #                         <body style="max-width:350px;">
    #                                 <h3>Hi, {name}!</h3>
    #                                 <div>The following issue in the project <b>{project_name}</b> has been changed to {action} by {doer}:<div>
    #                                 <br>
                                    
    #                                 <b>{issue_subject}</b>
    #                                 <br>
    #                                 <center>
    #                                     <div style="margin-top:30px; border-radius:5px; border-width:0px; text-align:center; background:#5390d9; width:50%; height:fit-content; padding:13px; display: table;">
    #                                         <center>
    #                                             <div style="display:table-cell; vertical-align:middle;"> 
    #                                                 <a style="color:white; font-size:16px;" href="{project_link}">Go to Project</a>
    #                                             </div>
    #                                         </center>
    #                                     </div>
    #                                 </center>
    #                                 <br>
    #                                 Bon Testing!<br>
    #                                 The Pesticide Bot<br>
    #                         </body>
    #                     </html>
    #                """

    #         # def sendMail(self, subject, from_user_name, to_user_name, receiver_email, text, html):
    #         send_mail(
    #             subject=f"[PESTICIDE] Issue Status Update: {subject} in {project_name}",
    #             message=text,
    #             from_email=settings.EMAIL_HOST_USER,
    #             recipient_list=[email, ],
    #             html_message=html
    #         )

    # def statusUpdate(self, user_email, user_name, change, changer):
    #     if change == "promote":
    #         text = f"""
    #                     Hi, {user_name}!
    #                     You have been promoted to the role of <b>ADMIN</b> by {changer}!
    #                     Bon Testing!
    #                     The Buggernaut Bot
    #                        """
    #         html = f"""
    #                    <html>
    #                         <head></head>
    #                         <body>
    #                                 <h3>Hi, {user_name}!</h3>
    #                                 <div>You have been promoted to the role of <b>ADMIN</b> by {changer}!<div>
    #                                 <br>
    #                                 Bon Testing!<br>
    #                                 The Buggernaut Bot<br>
    #                         </body>
    #                     </html>
    #                    """
    #     elif change == "demote":
    #         text = f"""
    #                     Hi, {user_name}!
    #                     You have been demoted to the role of <b>USER</b> by {changer}.
    #                     Bon Testing!
    #                     The Buggernaut Bot
    #                        """

    #         html = f"""
    #                    <html>
    #                         <head></head>
    #                         <body>
    #                                 <h3>Hi, {user_name}!</h3>
    #                                 <div>You have been demoted to the role of <b>USER</b> by {changer}.<div>
    #                                 <br>
    #                                 Bon Testing!<br>
    #                                 The Buggernaut Bot<br>
    #                         </body>
    #                     </html>
    #                    """

    #     send_mail(subject=f"Buggernaut Role Update", message=text, from_email="The Buggernaut Bot",
    #               recipient_list=[user_email, ], html_message=html)

    # def banOrAdmitUser(self, user_email, user_name, change, changer):
    #     if change == "banned":
    #         text = f"""
    #                     Dear {user_name},
    #                     You have been banned from Buggernaut by {changer}.
    #                     The Buggernaut Bot
    #                        """
    #         html = f"""
    #                    <html>
    #                         <head></head>
    #                         <body>
    #                                 <h3>Dear {user_name},</h3>
    #                                 <div>You have been banned from Buggernaut by {changer}.<div>
    #                                 <br>
    #                                 The Buggernaut Bot<br>
    #                         </body>
    #                     </html>
    #                    """
    #     elif change == "admit":
    #         text = f"""
    #                     Dear {user_name},
    #                     You have been readmitted Buggernaut by {changer}.
    #                     The Buggernaut Bot
    #                        """

    #         html = f"""
    #                    <html>
    #                         <head></head>
    #                         <body>
    #                                 <h3>Dear {user_name},</h3>
    #                                 <div>You have been readmitted Buggernaut by {changer}.<div>
    #                                 <br>
    #                                 The Buggernaut Bot<br>
    #                         </body>
    #                     </html>
    #                    """
    #     subject = ""
    #     if change == "banned":
    #         subject = "BANNED!"
    #     elif change == "admit":
    #         subject = "Welcome Back!"

    #     send_mail(subject=subject, message=text, from_email="The Buggernaut Bot",
    #               recipient_list=[user_email, ], html_message=html)

    # def deployProject(self, project, deployed_by, team_members=[]):

    #     for mem in team_members:

    #         text = f"""
    #                             Woohoo!
    #                             Your app {project} has been deployed by {deployed_by}.
    #                             You now step into the world of fixing production bugs. Yayyyy!        
    #                             Enjoy :)
    #                             The Buggernaut Bot
    #                                """
    #         html = f"""
    #                            <html>
    #                                 <head></head>
    #                                 <body>
    #                                         <h3>Woohoo!</h3>
    #                                         Your app {project} has been deployed by {deployed_by}. <br>
    #                                         You now step into the world of fixing production bugs. Yayyyy!<br>
    #                                         <br>
    #                                         Enjoy :) <br>
    #                                         The Buggernaut Bot<br><br>
    #                                 </body>
    #                             </html>
    #                            """

    #         send_mail(subject="CONGRATULATIONS!", message=text, from_email="The Buggernaut Bot",
    #                   recipient_list=[mem.email, ], html_message=html)
