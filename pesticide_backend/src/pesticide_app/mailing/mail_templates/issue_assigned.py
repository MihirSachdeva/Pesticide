class IssueAssignTemplate():
    """
    Used to create HTML message to send in email to a user when an issue is assigned to them.
    """

    def __init__(self, project_name, project_page_link, issue_title, issue_tags, assigned_by, person_name, app_link):
        self.project_name = project_name
        self.project_page_link = project_page_link
        self.issue_title = issue_title
        self.issue_tags = issue_tags
        self.assigned_by = assigned_by.name
        self.person_name = person_name
        self.app_link = app_link
        self.app_settings_link = app_link + '/settings'

        self.common_1 = f"""
                            <html>
                                <head></head>
                                <body
                                style="font-family: Arial, Helvetica, sans-serif; padding: 0; margin: 0;"
                                >
                                <div
                                    style="
                                    margin: 10px;
                                    padding: 0;
                                    font-family: Arial, Helvetica, sans-serif;
                                    border: 1px solid rgba(95, 95, 95, 0.5);
                                    border-radius: 10px;
                                    "
                                >
                                    <div
                                    style="
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        padding: 25px 20vw;
                                    "
                                    >
                                    <span style="font-size: 3em; margin: auto 0;"><strong>Pesticide</strong></span>
                                    </div>

                                    <hr
                                    style="
                                        border: 0;
                                        height: 1px;
                                        background-color: rgba(95, 95, 95, 0.5);
                                        width: 100%;
                                        margin: 0;
                                    "
                                    />

                                    <div style="padding: 25px 20vw;">
                                    <div style="font-size: 1.5em; margin-bottom: 10px;">Hi, {self.person_name}!</div>

                                    <div style="line-height: 1.3; font-style: 1.2em;">
                                        This is an auto-generated email to inform you that
                                        <span
                                        style="
                                            background: linear-gradient(to bottom,#bebebe 0%,#a1a1a1 100%);
                                            padding: 6px;
                                            border-radius: 4px;
                                            display: inline-flex;
                                        "
                                        >
                                        <div><strong>{self.assigned_by}</strong></div>
                                        </span>
                    
                                        assigned you an issue in the project
        
                                        <strong>{self.project_name}</strong>.
                                    </div>

                                    <div style="width: 100%; display: flex; justify-content: center;">
                                        <a
                                        href="{self.project_page_link}"
                                        style="text-decoration: none; color: unset; margin: 15px;"
                                        >
                                        <div
                                            style="
                                            display: flex;
                                            align-items: center;
                                            justify-content: center;
                                            border-radius: 10px;
                                            border: 1px solid rgba(95, 95, 95, 0.5);
                                            padding: 10px;
                                            margin: auto;
                                            margin-top: 10px;
                                            "
                                        >
                                            <img
                                            src="https://omniport.readthedocs.io/en/latest/_static/site/op_logo.png"
                                            style="width: 50px; border-radius: 7px; margin-right: 5px;"
                                            />
                                            <div style="font-size: 1.2em; margin: auto 0;">
                                            <strong>{self.project_name}</strong>
                                            </div>
                                        </div>
                                        </a>
                                    </div>

                                    <div
                                        style="
                                        width: 100%;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        padding: 15px 0;
                                        "
                                    >
                                        <div
                                        style="
                                            border-radius: 10px;
                                            border: 1px solid rgba(95, 95, 95, 0.5);
                                        "
                                        >
                                        <div
                                            style="
                                            display: flex;
                                            align-items: center;
                                            justify-content: space-between;
                                            padding: 10px;
                                            "
                                        >
                                            <div style="margin-right: 20px; font-size: 1.2em;">
                                            <strong>{self.issue_title}</strong>
                                            </div>
                                        </div>
                                        <hr
                                            style="
                                            border: 0;
                                            height: 1px;
                                            background-color: rgba(95, 95, 95, 0.5);
                                            width: 100%;
                                            margin: 0;
                                            "
                                        />
                                        <div
                                            style="
                                                max-width: 500px;
                                                padding: 15px;
                                            "
                                        >
                        """

        self.common_2 = f"""                            
                                        </div>
                                        <hr
                                            style="
                                            border: 0;
                                            height: 1px;
                                            background-color: rgba(95, 95, 95, 0.5);
                                            width: 100%;
                                            margin: 0;
                                            "
                                        />
                                        <a href="{self.project_page_link}" style="text-decoration: none;">
                                            <div
                                            style="
                                                background: linear-gradient(to bottom, #61aaee 0%, #398edd 100%);
                                                color: #fff;
                                                text-align: center;
                                                border-bottom-right-radius: 10px;
                                                border-bottom-left-radius: 10px;
                                                padding: 10px;
                                                font-weight: 900;
                                            "
                                            >
                                            <stong>View In Pesticide</stong>
                                            </div>
                                        </a>
                                        </div>
                                    </div>
                                    <div
                                        style="
                                        font-size: 1em;
                                        padding-top: 20px;
                                        text-align: center;
                                        font-weight: 900;
                                        "
                                    >
                                        The Pesticide Mailer
                                    </div>
                                    </div>
                                    <hr
                                    style="
                                        border: 0;
                                        height: 1px;
                                        background-color: rgba(95, 95, 95, 0.5);
                                        width: 100%;
                                        margin: 0;
                                    "
                                    />
                                    <div
                                    style="
                                        padding: 25px 20vw;
                                        display: flex;
                                        align-items: center;
                                        justify-content: space-between;
                                    "
                                    >
                                    <a
                                        href="{self.app_settings_link}"
                                        style="text-decoration: none; color: unset; margin-right: 50px;"
                                    >
                                        <div
                                        style="
                                            height: 10px;
                                            border-radius: 4px;
                                            background: linear-gradient(to bottom, #fb0000 0%, #a80000 100%);
                                            padding: 15px;
                                            display: table-cell;
                                            justify-content: center;
                                            font-size: 1.3em;
                                            color: #fff;
                                        "
                                        >
                                        <strong>Unsubscribe</strong>
                                        </div>
                                    </a>
                                    <a href="{self.app_link}" style="text-decoration: none; color: unset;">
                                        <div
                                        style="
                                            height: 10px;
                                            border-radius: 4px;
                                            background: linear-gradient(to bottom, #bebebe 0%, #a1a1a1 100%);
                                            padding: 15px;
                                            display: table-cell;
                                            justify-content: center;
                                            font-size: 1.3em;
                                        "
                                        >
                                        <strong>Pesticide</strong>
                                        </div>
                                    </a>
                                    </div>
                                </div>
                                </body>
                            </html>
                        """

    def for_issue_assignee(self):
        """
        For issue assignee.
        """

        tag_boxes = ""
        for tag in self.issue_tags:
            tag_boxes += f"""
                                <span
                                    style="
                                        border-radius: 7px;
                                        padding: 5px;
                                        margin: 7px;
                                        border: 1px solid rgba(95, 95, 95, 0.5);
                                        color: {tag.color};
                                        font-size: 1.3em;
                                    "
                                >
                                    <strong>#{tag.tag_text}</strong>
                                </span>
                          """
        email_template = self.common_1 + tag_boxes + self.common_2
        return email_template
