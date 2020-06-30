import React from 'react';
import IssueItem from '../components/IssueItem';
import axios from 'axios';
import { render } from 'react-dom';
import * as api_links from '../APILinks';
export default function IssueList(props) {

    const [project, setProject] = React.useState({issues: []});

    React.useEffect(() => {
        const projectID = props.projectID;
        axios.get(api_links.API_ROOT + `projects/${projectID}/`)
            .then(res => {
                setProject(res.data);
            })
            .catch(err => console.log(err));
    }, []);

    return (
        <>
            {
                project.issues.map((issue, index) => (
                    <IssueItem 
                        id={index + 1}
                        status={issue.status}
                        date={issue.timestamp}
                        title={issue.title}
                        content={issue.description}
                        assignedTo={issue.assigned_to}
                        reportedBy={issue.reporter}
                        tags={issue.tags}
                        project={issue.project}
                        projectname={project.name}
                        comments={issue.comments}
                    />
                ))
            }       
        </>
    );
}
