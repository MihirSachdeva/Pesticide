import React from 'react';
import IssueItem from '../components/IssueItem';
import axios from 'axios';
import { render } from 'react-dom';

export default function IssueList(props) {

    const [project, setProject] = React.useState({issues: []});

    React.useEffect(() => {
        const projectID = props.projectID;
        axios.get(`http://127.0.0.1:8000/api/projects/${projectID}/`)
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
