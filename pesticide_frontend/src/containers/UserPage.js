import React from 'react';
import UserCard from '../components/UserCard';
import ProjectInfo from '../components/ProjectInfo';
import IssueItem from '../components/IssueItem';

import Axios from "axios";
import { Typography } from '@material-ui/core';
import Card from "@material-ui/core/Card";

export default function UserPage(props) {

  const enrollmentNumber = props.match.params.enrollmentNumber;

  const [user, setUser] = React.useState({});
  const [projectList, setProjectList] = React.useState([]);
  const [issueList, setIssueList] = React.useState({
    issuesAssigned: [],
    issuesReported: []
  });
  const [tagNameColorList, setTagNameColorList] = React.useState([]);
  const [userNameList, setUserNameList] = React.useState([]);
  const [enrNoList, setEnrNoList] = React.useState([]);


  React.useEffect(() => {
    Axios.get(`http://127.0.0.1:8000/api/userByEnrNo/${enrollmentNumber}`)
      .then(res => {
        setUser(res.data);
        Axios.get('http://127.0.0.1:8000/api/projects')
          .then(res2 => {
            let projectsOfUser = res2.data.filter(project => project.members.includes(res.data.id))
            setProjectList(projectsOfUser);
          })
          .catch(err => console.log(err));

        Axios.get('http://127.0.0.1:8000/api/issues')
          .then(res3 => {
            let issuesAssigned = res3.data.filter(issue => issue.assigned_to == res.data.id);
            setIssueList(prev => ({
              ...prev,
              issuesAssigned: issuesAssigned
            }));
            let issuesReported = res3.data.filter(issue => issue.reporter == res.data.id);
            setIssueList(prev => ({
              ...prev,
              issuesReported: issuesReported
            }));
          })
          .catch(err => console.log(err));

        Axios.get('http://127.0.0.1:8000/api/tags/')
          .then(res4 => {
            let tagNameColorList = {};
            res4.data.map(tag => {
              tagNameColorList[tag.id] = {
                tagText: tag.tag_text,
                tagColor: tag.color
              };
            });
            setTagNameColorList(tagNameColorList);
          })
          .catch(err => console.log(err));

        Axios.get('http://127.0.0.1:8000/api/users/')
          .then(res5 => {
            let userNameList = {};
            res5.data.map(user => userNameList[user.id] = user.name);
            setUserNameList(userNameList);
            let userEnrNoList = {};
            res5.data.map(user => userEnrNoList[user.id] = user.enrollment_number);
            setEnrNoList(userEnrNoList);
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }, []);

  const getIssues = () => {
    const token = localStorage.getItem('token');
    Axios.defaults.headers = {
      'Content-Type': 'application/json',
      Authorization: 'Token ' + token
    }

    Axios.get('http://127.0.0.1:8000/api/issues')
      .then(res3 => {
        let issuesAssigned = res3.data.filter(issue => issue.assigned_to == user.id);
        setIssueList(prev => ({
          ...prev,
          issuesAssigned: issuesAssigned
        }));
        let issuesReported = res3.data.filter(issue => issue.reporter == user.id);
        setIssueList(prev => ({
          ...prev,
          issuesReported: issuesReported
        }));
      })
      .catch(err => console.log(err));
  }

  const currentUser = localStorage.getItem('id');

  return (
    <>
      <UserCard
        id={user.id}
        name={user.name}
        is_admin={user.is_admin}
        enrollment_number={user.enrollment_number}
        degree={user.degree}
        branch={user.branch}
        current_year={user.current_year}
        is_active={user.is_active}
        user={user.user}
        display_photo={user.display_picture}
      />
      <Typography style={{ textAlign: 'center' }}>Projects: </Typography>
      {
        projectList.length != 0 ?
          projectList.map(project => (
            <ProjectInfo
              projectID={project.id}
              projectslug={project.projectslug}
            />
          ))
          :
          <Card style={{ padding: '15px', margin: '20px', borderRadius: '10px' }}>No Projects</Card>
      }

      <Typography style={{ textAlign: 'center' }}>Issues Reported: </Typography>

      <Card className="issue-container-card issues-list" style={{ margin: '10px', paddingBottom: '7px' }}>
        {
          issueList.issuesReported.length != 0 ?
            issueList.issuesReported.map((issue, index) => (
              <IssueItem
                id={issue.id}
                issueIndex={index + 1}
                status={issue.status}
                date={issue.timestamp}
                title={issue.title}
                content={issue.description}
                assigneeId={issue.assigned_to}
                reporterId={issue.reporter}
                tags={issue.tags}
                project={issue.project}
                projectname={issue.project_name}
                comments={issue.comments}
                image={issue.image[0]}
                tagNameColorList={tagNameColorList}
                userNameList={userNameList}
                enrNoList={enrNoList}
                showProjectNameOnCard
                currentUser={currentUser}
                getIssues={getIssues}
              />
            ))
            :
            <div style={{ padding: '10px 14px 14px 14px' }}>No Issues Reported</div>
        }
      </Card>
      <br />
      <Typography style={{ textAlign: 'center' }}>Issues Assigned: </Typography>

      <Card className="issue-container-card issues-list" style={{ margin: '10px', paddingBottom: '7px' }}>
        {
          issueList.issuesAssigned.length != 0 ?
            issueList.issuesAssigned.map((issue, index) => (
              <IssueItem
                id={issue.id}
                issueIndex={index + 1}
                status={issue.status}
                date={issue.timestamp}
                title={issue.title}
                content={issue.description}
                assigneeId={issue.assigned_to}
                reporterId={issue.reporter}
                tags={issue.tags}
                project={issue.project}
                projectname={issue.project_name}
                comments={issue.comments}
                image={issue.image[0]}
                tagNameColorList={tagNameColorList}
                userNameList={userNameList}
                enrNoList={enrNoList}
                showProjectNameOnCard
                currentUser={currentUser}
                getIssues={getIssues}
              />
            ))
            :
            <div style={{ padding: '10px 14px 14px 14px' }}>No Issues Assigned</div>
        }
      </Card>
      <div className="artwork-container">
        <img
          src={[
            '../developer1.svg',
            '../developer2.png'
          ][Math.round(Math.random() * 1)]
          }
          className="artwork-large"
        />

      </div>

    </>
  );
}