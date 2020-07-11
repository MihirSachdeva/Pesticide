import React from "react";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import FilterListIcon from '@material-ui/icons/FilterList';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { connect } from "react-redux";
import { Link, withRouter, Redirect } from 'react-router-dom';

import IssueItem from "../components/IssueItem";
import SkeletonIssue from "../components/SkeletonIssue";
import ProjectInfo from "../components/ProjectInfo";
import NewIssueWithModal from "../components/NewIssueWithModal";

import axios from 'axios';
import Skeleton from "@material-ui/lab/Skeleton";

import * as api_links from '../APILinks';
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

  const Theme = useTheme();
  const isMobile = useMediaQuery(Theme.breakpoints.down('sm'));

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

  const [issues, setIssues] = React.useState({
    all: [],
    open: [],
    fixed_closed: []
  });

  const [issuesOriginal, setIssuesOriginal] = React.useState({
    all: [],
    open: [],
    fixed_closed: []
  });

  const [tagNameColorList, setTagNameColorList] = React.useState();

  const [tagList, setTagList] = React.useState();

  const [statusList, setStatusList] = React.useState([]);

  const [userNameList, setUserNameList] = React.useState();

  const [enrNoList, setEnrNoList] = React.useState();

  const [pid, setPid] = React.useState();

  React.useEffect(() => {
    axios.get(api_links.API_ROOT + 'issuestatus/')
      .then(res => {
        setStatusList(res.data.map(status => ({
          text: status.status_text,
          color: status.color,
          type: status.status_type,
          id: status.id
        })));
      })
      .catch(err => console.log(err));

    axios.get(api_links.API_ROOT + 'projectnameslug/')
      .then(res => {
        const projectslug = props.match.params.projectslug;
        const requiredProject = res.data.filter(project => project.projectslug == projectslug)[0];
        setPid(requiredProject.id);
        setProject(requiredProject);

        axios.get(api_links.API_ROOT + `projects/${requiredProject.id}/`)
          .then(res1 => {

            axios.get(api_links.API_ROOT + 'tags/')
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
                  open: res1.data.issues.filter((issue, index) => issue.status_type == 'Pending'),
                  fixed_closed: res1.data.issues.filter((issue, index) => issue.status_type == 'Closed' || issue.status_type == 'Resolved'),
                });
                setIssuesOriginal({
                  all: res1.data.issues,
                  open: res1.data.issues.filter((issue, index) => issue.status_type == 'Pending'),
                  fixed_closed: res1.data.issues.filter((issue, index) => issue.status_type == 'Closed' || issue.status_type == 'Resolved'),
                });
              })
              .catch(err => console.log(err));

            axios.get(api_links.API_ROOT + 'users/')
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
    setTimeout(() => {
      const token = localStorage.getItem('token');
      axios.defaults.headers = {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + token
      }

      axios.get(api_links.API_ROOT + `projects/${pid}/`)
        .then(res1 => {
          console.log(res1.data.issues);
          setIssuesOriginal({
            all: res1.data.issues,
            open: res1.data.issues.filter((issue, index) => issue.status_type == 'Pending'),
            fixed_closed: res1.data.issues.filter((issue, index) => issue.status_type == 'Closed' || issue.status_type == 'Resolved'),
          });
          setIssues({
            all: res1.data.issues,
            open: res1.data.issues.filter((issue, index) => issue.status_type == 'Pending'),
            fixed_closed: res1.data.issues.filter((issue, index) => issue.status_type == 'Closed' || issue.status_type == 'Resolved'),
          });
        })
        .catch(err => console.log(err));
    }, 500);
    setFilterTags({
      all: [],
      open: [],
      fixed_closed: []
    });
  }

  const theme = localStorage.getItem('theme') || 'default';
  const gradients = {
    default: {
      start: '#3b5998',
      end: '#3b5998a0'
    },

    dark: {
      start: '#6617cbb3',
      end: '#cb218eb3'
    },

    palpatine: {
      start: '#2a2a2ab3',
      end: '#000000b3'
    },

    solarizedDark: {
      start: '#003f4fb3',
      end: '#001b22b3'
    },

    solarizedLight: {
      start: '#faf4e0',
      end: '#eee8d5'
    },

  }
  const waveColorStart = {
    stopColor: gradients[theme].start,
    stopOpacity: 1,
  }

  const waveColorEnd = {
    stopColor: gradients[theme].end,
    stopOpacity: 1,
  }

  const [anchorElTag, setAnchorElTag] = React.useState(null);

  const handleClickTag = (event) => {
    setAnchorElTag(event.currentTarget);
  };

  const handleCloseTag = () => {
    setAnchorElTag(null);
  };

  const [filterTags, setFilterTags] = React.useState({
    all: [],
    open: [],
    fixed_closed: []
  });

  const handleFilterTagAdd = (tagId, type) => {
    let toUpdate = !filterTags[type].includes(tagId);
    let newFilterTagList;
    toUpdate && (newFilterTagList = [...filterTags[type], tagId]);
    toUpdate && setFilterTags(prev => ({
      ...prev,
      [type]: newFilterTagList
    }));
    toUpdate && setIssues(prev => ({
      ...prev,
      [type]: issuesOriginal[type].filter(issue => Boolean(issue.tags.filter(tag => newFilterTagList.includes(tag)).length))
    }));
  }

  const handleFilterTagRemove = (tagId, type) => {
    let newFilterTagList = filterTags[type].filter(tag => tag != tagId)
    setFilterTags(prev => ({
      ...prev,
      [type]: newFilterTagList
    }));
    setIssues(prev => ({
      ...prev,
      [type]:
        Boolean(newFilterTagList.length) ?
          issuesOriginal[type].filter(issue => Boolean(issue.tags.filter(tag => newFilterTagList.includes(tag)).length))
          :
          issuesOriginal[type]
    }));
  }

  return (
    <div>
      {project.id && <ProjectInfo projectID={project.id} projectslug={project.projectslug} currentUser={currentUser} />}

      <AppBar position="sticky">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab style={{ textTransform: 'none' }} label="All" {...a11yProps(0)} />
          <Tab style={{ textTransform: 'none' }} label="Open" {...a11yProps(1)} />
          <Tab style={{ textTransform: 'none' }} label="Fixed/Closed" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>

        <div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', padding: '7px', margin: '7px 0' }}>
            <div style={{ display: 'flex' }}>
              <>
                {
                  !isMobile &&
                  <div className="issue-tag-filter-chip-container">
                    {
                      filterTags.all != [] && filterTags.all.map(tag => (
                        <Chip
                          className="issue-filter-tag-chip"
                          label={
                            <div
                              style={{
                                color: tagNameColorList[tag].tagColor,
                                fontWeight: '900'
                              }}
                            >
                              #
                               <span className='issue-tag-text'>{tagNameColorList[tag].tagText}</span>
                            </div>
                          }
                          onDelete={() => handleFilterTagRemove(tag, 'all')}
                        />
                      ))
                    }

                  </div>
                }
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center"
                  }}
                >
                  <Button
                    startIcon={<FilterListIcon />}
                    className="btn-filled"
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={handleClickTag}
                  >
                    Filter
                </Button>
                </div>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorElTag}
                  keepMounted
                  open={Boolean(anchorElTag)}
                  onClose={handleCloseTag}
                  style={{ marginTop: '50px', maxHeight: '350px' }}
                >
                  {
                    tagList != undefined && tagList.map(tag =>
                      <MenuItem onClick={() => {
                        handleCloseTag(tag.id);
                        handleFilterTagAdd(tag.id, 'all');
                      }}
                      >
                        <div
                          style={{
                            color: tag.color,
                            fontWeight: '900'
                          }}
                        >
                          <span className='issue-tag-text'>{"#" + tag.tag_text}</span>
                        </div>
                      </MenuItem>
                    )
                  }
                </Menu>
              </>
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
        </div>

        {
          isMobile &&
          <div className="issue-tag-filter-chip-container">
            {
              filterTags.all != [] && filterTags.all.map(tag => (
                <Chip
                  className="issue-filter-tag-chip"
                  label={
                    <div
                      style={{
                        color: tagNameColorList[tag].tagColor,
                        fontWeight: '900'
                      }}
                    >
                      #
                    <span className='issue-tag-text'>{tagNameColorList[tag].tagText}</span>
                    </div>
                  }
                  onDelete={() => handleFilterTagRemove(tag, 'all')}
                />
              ))
            }

          </div>
        }

        <div className="issues-list" style={projectsList}>
          {
            issues.all[0] != undefined ?
              issues.all && issues.all.map((issue, index) => (
                <IssueItem
                  id={issue.id}
                  issueIndex={index + 1}
                  statusText={issue.status_text}
                  statusType={issue.status_type}
                  statusColor={issue.status_color}
                  statusId={issue.status}
                  statusList={statusList}
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
              :
              issues.all.length == 0 ?
                <center>
                  <Typography>
                    No issue has been reported yet.
                </Typography>
                </center>
                :
                <>
                  <SkeletonIssue first />
                  <SkeletonIssue />
                  <SkeletonIssue />
                  <SkeletonIssue />
                  <SkeletonIssue last />
                </>
          }


        </div>



      </TabPanel>

      <TabPanel value={value} index={1}>
        <div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', padding: '7px', margin: '7px 0' }}>
            <div style={{ display: 'flex' }}>
              <>
                {
                  !isMobile &&
                  <div className="issue-tag-filter-chip-container">
                    {
                      filterTags.open != [] && filterTags.open.map(tag => (
                        <Chip
                          className="issue-filter-tag-chip"
                          label={
                            <div
                              style={{
                                color: tagNameColorList[tag].tagColor,
                                fontWeight: '900'
                              }}
                            >
                              #
                               <span className='issue-tag-text'>{tagNameColorList[tag].tagText}</span>
                            </div>
                          }
                          onDelete={() => handleFilterTagRemove(tag, 'open')}
                        />
                      ))
                    }

                  </div>
                }
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center"
                  }}
                >
                  <Button
                    startIcon={<FilterListIcon />}
                    className="btn-filled"
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={handleClickTag}
                  >
                    Filter
                </Button>
                </div>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorElTag}
                  keepMounted
                  open={Boolean(anchorElTag)}
                  onClose={handleCloseTag}
                  style={{ marginTop: '50px', maxHeight: '350px' }}
                >
                  {
                    tagList != undefined && tagList.map(tag =>
                      <MenuItem onClick={() => {
                        handleCloseTag(tag.id);
                        handleFilterTagAdd(tag.id, 'open');
                      }}
                      >
                        <div
                          style={{
                            color: tag.color,
                            fontWeight: '900'
                          }}
                        >
                          <span className='issue-tag-text'>{"#" + tag.tag_text}</span>
                        </div>
                      </MenuItem>
                    )
                  }
                </Menu>
              </>
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
        </div>

        {
          isMobile &&
          <div className="issue-tag-filter-chip-container">
            {
              filterTags.open != [] && filterTags.open.map(tag => (
                <Chip
                  className="issue-filter-tag-chip"
                  label={
                    <div
                      style={{
                        color: tagNameColorList[tag].tagColor,
                        fontWeight: '900'
                      }}
                    >
                      #
                    <span className='issue-tag-text'>{tagNameColorList[tag].tagText}</span>
                    </div>
                  }
                  onDelete={() => handleFilterTagRemove(tag, 'open')}
                />
              ))
            }
          </div>
        }

        <div className="issues-list" style={projectsList}>
          {
            issues.open.length != 0 ? issues.open.map((issue, index) => (
              <IssueItem
                id={issue.id}
                issueIndex={index + 1}
                statusText={issue.status_text}
                statusType={issue.status_type}
                statusColor={issue.status_color}
                statusId={issue.status}
                statusList={statusList}
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
              :
              issues.open.length == 0 ?
                <center>
                  <Typography>
                    No open issues.
                </Typography>
                </center>
                :
                <>
                  <SkeletonIssue first />
                  <SkeletonIssue />
                  <SkeletonIssue />
                  <SkeletonIssue />
                  <SkeletonIssue last />
                </>
          }


        </div>

      </TabPanel>

      <TabPanel value={value} index={2}>
        <div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', padding: '7px', margin: '7px 0' }}>
            <div style={{ display: 'flex' }}>
              <>
                {
                  !isMobile &&
                  <div className="issue-tag-filter-chip-container">
                    {
                      filterTags.fixed_closed != [] && filterTags.fixed_closed.map(tag => (
                        <Chip
                          className="issue-filter-tag-chip"
                          label={
                            <div
                              style={{
                                color: tagNameColorList[tag].tagColor,
                                fontWeight: '900'
                              }}
                            >
                              #
                               <span className='issue-tag-text'>{tagNameColorList[tag].tagText}</span>
                            </div>
                          }
                          onDelete={() => handleFilterTagRemove(tag, 'fixed_closed')}
                        />
                      ))
                    }

                  </div>
                }
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center"
                  }}
                >
                  <Button
                    startIcon={<FilterListIcon />}
                    className="btn-filled"
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={handleClickTag}
                  >
                    Filter
                </Button>
                </div>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorElTag}
                  keepMounted
                  open={Boolean(anchorElTag)}
                  onClose={handleCloseTag}
                  style={{ marginTop: '50px', maxHeight: '350px' }}
                >
                  {
                    tagList != undefined && tagList.map(tag =>
                      <MenuItem onClick={() => {
                        handleCloseTag(tag.id);
                        handleFilterTagAdd(tag.id, 'fixed_closed');
                      }}
                      >
                        <div
                          style={{
                            color: tag.color,
                            fontWeight: '900'
                          }}
                        >
                          <span className='issue-tag-text'>{"#" + tag.tag_text}</span>
                        </div>
                      </MenuItem>
                    )
                  }
                </Menu>
              </>
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
        </div>

        {
          isMobile &&
          <div className="issue-tag-filter-chip-container">
            {
              filterTags.fixed_closed != [] && filterTags.fixed_closed.map(tag => (
                <Chip
                  className="issue-filter-tag-chip"
                  label={
                    <div
                      style={{
                        color: tagNameColorList[tag].tagColor,
                        fontWeight: '900'
                      }}
                    >
                      #
                    <span className='issue-tag-text'>{tagNameColorList[tag].tagText}</span>
                    </div>

                  }
                  onDelete={() => handleFilterTagRemove(tag, 'fixed_closed')}
                />
              ))
            }
          </div>
        }


        <div className="issues-list" style={projectsList}>
          {
            issues.fixed_closed[0] != undefined ? issues.fixed_closed.map((issue, index) => (
              <IssueItem
                id={issue.id}
                issueIndex={index + 1}
                statusText={issue.status_text}
                statusType={issue.status_type}
                statusColor={issue.status_color}
                statusId={issue.status}
                statusList={statusList}
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
              :
              issues.fixed_closed.length == 0 ?
                <center>
                  <Typography>
                    No fixed/closed issues.
                </Typography>
                </center>
                :
                <>
                  <SkeletonIssue first />
                  <SkeletonIssue />
                  <SkeletonIssue />
                  <SkeletonIssue />
                  <SkeletonIssue last />
                </>
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