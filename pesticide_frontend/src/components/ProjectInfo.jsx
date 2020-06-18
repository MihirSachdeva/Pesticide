import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import Skeleton from '@material-ui/lab/Skeleton';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { useTheme } from '@material-ui/core/styles';

import MemberButton from "./MemberButton";

import { EditorState } from 'draft-js';
import { DraftailEditor } from 'draftail';
import { stateFromHTML } from 'draft-js-import-html';

import { Link } from "react-router-dom";

import axios from 'axios';

import EditProjectWithModal from './EditProjectWithModal';

const useStyles = makeStyles(theme => ({
  root: {},
  media: {
    height: 0,
    paddingTop: "56.25%"
  },
  expand: {
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: red[500]
  }
}));

const memberCardContainer = {
  display: "flex",
  flexDirection: "row",
  // height: "110px",
  margin: "15px",
  alignItems: "center",
  overflowY: "auto"
}
// const isMobile = window.innerWidth < 600;


export default function ProjectInfo(props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const currentUser = localStorage.getItem('id');

  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const [editorState, setEditorState] = React.useState(EditorState.createEmpty());

  const [project, setProject] = React.useState({});

  const [projecticon, setProjecticon] = React.useState();

  const [currentUserIsMember, setCurrentUserIsMember] = React.useState(true);

  React.useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/projects/${props.projectID}/`)
      .then(res => {
        setProject(res.data);
        setCurrentUserIsMember(() => {
          return (res.data.members.map(member => member.toString()).includes(currentUser));
        });
        setProjecticon(res.data.icon[0] ? res.data.icon[0].image : "../appicon.png");
        setEditorState(EditorState.createWithContent(stateFromHTML(res.data.wiki)));
      })
      .catch(err => console.log(err));
  }, []);

  const handleProjectDelete = () => {
    let c = window.confirm("This project will be deleted permanently. Are you sure?")
    c && axios.delete(`http://127.0.0.1:8000/api/projects/${props.projectID}/`)
      .then(res => {
        let audio = new Audio('../sounds/navigation_selection-complete-celebration.wav');
        audio.play();
        setTimeout(() => {
          window.location.href = '/projects';
        }, 1000);
      })
      .catch(err => {
        console.log(err);
        let audio = new Audio('../sounds/alert_error-03.wav');
        audio.play();
      });

  }

  return (
    <Card style={{
      borderRadius: "10px",
      margin: "10px",
    }}>
      <CardHeader
        avatar={
          <div>
            {projecticon ?

              <img style={{
                maxWidth: isMobile ? "100px" : "130px",
                borderRadius: "15px",
                padding: "4px"
              }}
                src={projecticon}
                alt="Project Logo"
              />

              :

              <Skeleton
                variant="circle"
                width={100}
                height={100}
                animation="wave"
              />
            }
          </div>
        }

        title={!isMobile ?
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 25 }}>
              {
                !project.name
                  ?
                  <Skeleton width={100} height={50} animation="wave" />
                  :
                  <><Link to={"/projects/" + props.projectslug}>{project.name}</Link>&nbsp;&nbsp;</>
              }
              {
                project.link && <a href={project.link} target="_blank" style={{ marginRight: '10px' }}>
                  <IconButton style={{ backgroundColor: "rgba(129, 129, 129, 0.07)" }}>
                    <OpenInNewIcon />
                  </IconButton>
                </a>
              }
              <IconButton
                className={clsx(classes.expand, {
                  [classes.expandOpen]: expanded
                })}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
                style={{ backgroundColor: 'rgba(129, 129, 129, 0.07)' }}
              >
                {project.link && <ExpandMoreIcon />}
              </IconButton>
            </div>
            {
              project.members &&
              <div>
                {
                  (currentUserIsMember || project.creator == currentUser) &&
                  <div style={{ display: 'flex', padding: '10px', justifyContent: 'space-between' }}>
                    <EditProjectWithModal projectID={props.projectID} projectName={project.name} />
                    <IconButton
                      style={{ backgroundColor: "rgba(244, 67, 54, 0.15)", marginLeft: '10px' }}
                      onClick={handleProjectDelete}
                    >
                      <DeleteOutlineOutlinedIcon color="error" />
                    </IconButton>
                  </div>
                }
              </div>
            }
          </div>
          :
          <div>
            <div style={{ fontSize: 25 }}>
              {
                !project.name
                  ?
                  <Skeleton width={100} height={50} animation="wave" />
                  :
                  <Link to={"/projects/" + props.projectslug}>{project.name}</Link>
              }
            </div>

          </div>
        }
        subheader={
          !project.timestamp
            ?
            <Skeleton width={180} animation="wave" />
            :
            <div>
              {new Date(project.timestamp).getDate() + "/" + new Date(project.timestamp).getMonth() + "/" + new Date(project.timestamp).getFullYear()}
              <br />
              <span>{project.status}</span>
            </div>
        }
      />
      {isMobile &&
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {
            project.link && <a href={project.link} target="_blank">
              <IconButton
                style={{ backgroundColor: 'rgba(129, 129, 129, 0.07)', marginRight: '10px' }}
              >
                <OpenInNewIcon />
              </IconButton>
            </a>
          }
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
            style={{ backgroundColor: 'rgba(129, 129, 129, 0.07)' }}
          >
            {<ExpandMoreIcon />}
          </IconButton>
          {
            project.members &&
            <div>
              {
                (currentUserIsMember || project.creator.toString() === currentUser) &&
                <div style={{ display: 'flex', padding: '10px' }}>
                  <EditProjectWithModal projectID={props.projectID} projectName={project.name} />
                  <IconButton
                    style={{ backgroundColor: "rgba(244, 67, 54, 0.15)", marginLeft: '10px' }}
                    onClick={handleProjectDelete}
                  >
                    <DeleteOutlineOutlinedIcon color="error" />
                  </IconButton>
                </div>
              }
            </div>
          }
        </div>
      }
      <div style={memberCardContainer}>
        {
          !project.id
            ?
            <>
              <Skeleton height={70} width={200} animation="wave" style={{ marginRight: "10px" }} />
              <Skeleton height={70} width={200} animation="wave" style={{ marginRight: "10px" }} />
              <Skeleton height={70} width={200} animation="wave" style={{ marginRight: "10px" }} />
            </>
            :
            project.members.map(member => (
              <MemberButton user={member} />
            ))
        }
      </div>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <div className="issue-content">
            <DraftailEditor
              editorState={editorState}
              topToolbar={null}
            />
          </div>
        </CardContent>
      </Collapse>
    </Card>
  );
}