import React from "react";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import IssueItem from "../components/IssueItem";
import ProjectInfo from "../components/ProjectInfo";
import NewIssueWithModal from "../components/NewIssueWithModal";

import axios from 'axios';

// import IssueList from './IssueList';
// import IssueItem from '../components/IssueItem';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}



const projectsList = {
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto'
}





const ProjectPage = (props) => {

  const currentUser = localStorage.getItem('id');

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [project, setProject] = React.useState({});

  // const [issues, setIssues] = React.useState();
  const [issues, setIssues] = React.useState({
    all: [],
    open: [],
    fixed_closed: []
  });

  const [tagNameColorList, setTagNameColorList] = React.useState();

  const [tagList, setTagList] = React.useState();

  const [userNameList, setUserNameList] = React.useState();

  const [enrNoList, setEnrNoList] = React.useState();

  const [pid, setPid] = React.useState();

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    axios.defaults.headers = {
      'Content-Type': 'application/json',
      Authorization: 'Token ' + token
    }

    token && axios.get('http://127.0.0.1:8000/api/projectnameslug/')
      .then(res => {
        const projectslug = props.match.params.projectslug;
        const requiredProject = res.data.filter(project => project.projectslug == projectslug)[0];
        setPid(requiredProject.id);
        setProject(requiredProject);

        axios.defaults.headers = {
          'Content-Type': 'application/json',
          Authorization: 'Token ' + token
        }

        axios.get(`http://127.0.0.1:8000/api/projects/${requiredProject.id}/`)
          .then(res1 => {

            axios.get('http://127.0.0.1:8000/api/tags/')
              .then(res2 => {
                let tagList = res2.data;
                setTagList(tagList);
                let tagNameColorList = {};
                res2.data.map(tag => {
                  tagNameColorList[tag.id] = {
                    tagText: tag.tag_text,
                    tagColor: tag.color
                  };
                });
                setTagNameColorList(tagNameColorList);
                setIssues({
                  all: res1.data.issues,
                  open: res1.data.issues.filter((issue, index) => ['Open', 'Needs_more_information', 'Unclear'].includes(issue.status)),
                  fixed_closed: res1.data.issues.filter((issue, index) => ['Fixed', 'Closed', 'Not_a_bug'].includes(issue.status)),
                });
              })
              .catch(err => console.log(err));

            axios.get('http://127.0.0.1:8000/api/users/')
              .then(res3 => {
                let userNameList = {};
                res3.data.map(user => userNameList[user.id] = user.name);
                setUserNameList(userNameList);
                let userEnrNoList = {};
                res3.data.map(user => userEnrNoList[user.id] = user.enrollment_number);
                setEnrNoList(userEnrNoList);
              })
              .catch(err => console.log(err));

          })
          .catch(err => console.log(err));

      })
      .catch(err => console.log(err));
  }, []);

  const getIssues = () => {
    // const token = localStorage.getItem('token');
    // axios.defaults.headers = {
    //   'Content-Type': 'application/json',
    //   Authorization: 'Token ' + token
    // }

    // axios.get(`http://127.0.0.1:8000/api/projects/${pid}/`)
    //   .then(res => {
    //     setIssues(res.data.issues);
    //   })
    //   .catch(err => console.log(err));
    window.location.reload();
  }
  
  return (
    <div>
      {project.id && <ProjectInfo projectID={project.id} projectslug={project.projectslug} currentUser={currentUser}/>}

      <AppBar position="sticky">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="ALL ISSUES" {...a11yProps(0)} />
          <Tab label="OPEN ISSUES" {...a11yProps(1)} />
          <Tab label="FIXED / CLOSED" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>

        <div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '7px', margin: '7px 0' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Typography style={{ float: "left", marginLeft: '5px' }}>All Issues</Typography>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center"
              }}
            >
              <NewIssueWithModal
                project={project.id}
                projectname={project.name}
                getIssues={getIssues}
              />
            </div>
          </div>
        </div>

        <div className="projects-list" id="all-issues" style={projectsList}>
          {
            issues.all && issues.all.map((issue, index) => (
              <IssueItem
                id={issue.id}
                issueIndex={index + 1}
                status={issue.status}
                date={issue.timestamp}
                title={issue.title}
                content={issue.description}
                assignedTo={issue.assigned_to_name}
                reportedBy={issue.reporter_name}
                assigneeId={issue.assigned_to}
                reporterId={issue.reporter}
                tags={issue.tags}
                project={issue.project}
                projectname={project.name}
                comments={issue.comments}
                image={issue.image[0]}
                getIssues={getIssues}
                tagNameColorList={tagNameColorList}
                userNameList={userNameList}
                enrNoList={enrNoList}
                currentUser={currentUser}
              />
            ))
          }


        </div>



      </TabPanel>

      <TabPanel value={value} index={1}>
        <div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '7px', margin: '7px 0' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Typography style={{ float: "left", marginLeft: '5px' }}>Open Issues</Typography>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center"
              }}
            >

              <NewIssueWithModal
                project={project.id}
                projectname={project.name}
                getIssues={getIssues}
              />
            </div>
          </div>
        </div>

        <div className="projects-list" style={projectsList}>
          {
            issues.open && issues.open.map((issue, index) => (
              <IssueItem
                id={issue.id}
                issueIndex={index + 1}
                status={issue.status}
                date={issue.timestamp}
                title={issue.title}
                content={issue.description}
                assignedTo={issue.assigned_to_name}
                reportedBy={issue.reporter_name}
                assigneeId={issue.assigned_to}
                reporterId={issue.reporter}
                tags={issue.tags}
                project={issue.project}
                projectname={project.name}
                comments={issue.comments}
                image={issue.image[0]}
                getIssues={getIssues}
                tagNameColorList={tagNameColorList}
                userNameList={userNameList}
                enrNoList={enrNoList}
                currentUser={currentUser}
              />
            ))
          }


        </div>

      </TabPanel>

      <TabPanel value={value} index={2}>
        <div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '7px', margin: '7px 0' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Typography style={{ float: "left", marginLeft: '5px' }}>Fixed/Closed Issues</Typography>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center"
              }}
            >

              <NewIssueWithModal
                project={project.id}
                projectname={project.name}
                getIssues={getIssues}
              />
            </div>
          </div>
        </div>

        <div className="projects-list" style={projectsList}>
          {
            issues.fixed_closed && issues.fixed_closed.map((issue, index) => (
              <IssueItem
                id={issue.id}
                issueIndex={index + 1}
                status={issue.status}
                date={issue.timestamp}
                title={issue.title}
                content={issue.description}
                assignedTo={issue.assigned_to_name}
                reportedBy={issue.reporter_name}
                assigneeId={issue.assigned_to}
                reporterId={issue.reporter}
                tags={issue.tags}
                project={issue.project}
                projectname={project.name}
                comments={issue.comments}
                image={issue.image[0]}
                getIssues={getIssues}
                tagNameColorList={tagNameColorList}
                userNameList={userNameList}
                enrNoList={enrNoList}
                currentUser={currentUser}
              />
            ))
          }


        </div>

      </TabPanel>

      <NewIssueWithModal
        floating
        project={project.id}
        projectname={project.name}
        getIssues={getIssues}
        style={{ zIndex: 1100 }}
      />

    </div>
  );
}

export default ProjectPage;
