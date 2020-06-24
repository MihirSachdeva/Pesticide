import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Input from '@material-ui/core/Input';
import Tooltip from '@material-ui/core/Tooltip';
import { useTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import { IconButton, MenuItem } from '@material-ui/core';
import Slide from '@material-ui/core/Slide';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import Menu from '@material-ui/core/Menu';

import { Link } from 'react-router-dom';

import { EditorState } from 'draft-js';
import { DraftailEditor, BLOCK_TYPE, INLINE_STYLE, ENTITY_TYPE } from 'draftail';
import { stateFromHTML } from 'draft-js-import-html';

import ImageWithModal from './ImageWithModal';

import Axios from 'axios';

// const isMobile = window.innerWidth < 950;



const projectDetailsLeftRight = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
}

const issueContainer = {
  display: "flex",
  flexDirection: "column",
}


const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: 'none',
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export default function IssueItem(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClickOpen = () => {
    // let audio = new Audio('../sounds/navigation_transition-right.wav');
    // audio.play();
    setOpen(true);
  };

  const handleClose = () => {
    // let audio = new Audio('../sounds/navigation_transition-left.wav');
    // audio.play();
    setOpen(false);
  };

  const projectDetails = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: isMobile ? 'flex-start' : 'space-between',
    minWidth: '500px'
  }

  let contentState = stateFromHTML(props.content)

  const [editorState, setEditorState] = React.useState(EditorState.createWithContent(contentState));

  const [comments, setComments] = React.useState(props.comments);

  const [newComment, setNewComment] = React.useState({
    text: "",
    timestamp: new Date(),
    issue: props.id,
  });

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    if (newComment.text != "") {
      const token = localStorage.getItem('token');
      Axios.defaults.headers = {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + token
      }
      console.log(newComment);
      Axios.post('http://127.0.0.1:8000/api/comments/', newComment)
        .then(res => {
          console.log(res);
          setComments(prevComments => ([...prevComments, res.data]));
          setNewComment({
            text: "",
            timestamp: new Date(),
            issue: props.id,
          });
          let audio = new Audio('../sounds/navigation_forward-selection-minimal.wav');
          audio.play();
        })
        .catch(err => {
          console.log(err);
          // if (newComment.text == "") {
          //   alert("No point of an empty comment, SMH.");
          // } else {
          //   alert("Couldn't comment. Try again.");
          // }
          let audio = new Audio('../sounds/alert_error-03.wav');
          audio.play();
        });
    } else {
      let audio = new Audio('../sounds/alert_error-03.wav');
      audio.play();
    }
  }


  const handleNewComment = (event) => {
    const { name, value } = event.target;
    setNewComment(prevNewCommentState => ({
      ...prevNewCommentState,
      timestamp: new Date(),
      [name]: value
    }));
  }

  const handleCommentDelete = (commentID) => {
    const token = localStorage.getItem('token');
    Axios.defaults.headers = {
      'Content-Type': 'application/json',
      Authorization: 'Token ' + token
    }
    let c1 = window.confirm("This comment will be deleted permanently. Are you sure?");
    c1 && Axios.delete(`http://127.0.0.1:8000/api/comments/${commentID}/`)
      .then(res => {
        setComments(prevComments => prevComments.filter(comment => comment.id !== commentID));
        let audio = new Audio('../sounds/ui_refresh-feed.wav');
        audio.play();
      })
      .catch(err => console.log(err));
  }

  const handleIssueDelete = () => {
    const token = localStorage.getItem('token');
    Axios.defaults.headers = {
      'Content-Type': 'application/json',
      Authorization: 'Token ' + token
    }
    let c2 = window.confirm("This issue will be deleted permanently. Are you sure?");
    c2 && Axios.delete(`http://127.0.0.1:8000/api/issues/${props.id}/`)
      .then(res => {
        let audio = new Audio('../sounds/ui_refresh-feed.wav');
        audio.play();
        setTimeout(() => {
          props.getIssues();
          setOpen(false);
        }, 1000);
      })
      .catch(err => console.log(err));
  }
  const [issueUsers, setIssueUsers] = React.useState({
    reporter: {},
    assignee: {}
  });
  React.useEffect(() => {
    Axios.get(`http://127.0.0.1:8000/api/users/${props.reporterId}`)
      .then(res => {
        setIssueUsers(prev => ({
          ...prev,
          reporter: res.data
        }));
      })
      .catch(err => console.log(err));

    props.assigneeId && Axios.get(`http://127.0.0.1:8000/api/users/${props.assigneeId}`)
      .then(res => {
        setIssueUsers(prev => ({
          ...prev,
          assignee: res.data
        }));
      })
      .catch(err => console.log(err));
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return ('#217bf3');
        break;
      case 'Fixed':
        return ('#00ff00');
        break;
      case 'Not_a_bug':
        return ('#FF0000');
        break;
      case 'Needs_more_information':
        return ('#ffc107');
        break;
      case 'Unclear':
        return ('#ffc107');
        break;
      case 'Closed':
        return ('#FF0000');
        break;
      default:
        return ('#ffc107');
        break;
    }
  }

  const statusList = [
    {
      status: 'Open',
      color: '#217bf3'
    },
    {
      status: 'Fixed',
      color: '#00ff00'
    },
    {
      status: 'Not_a_bug',
      color: '#FF0000'
    },
    {
      status: 'Needs_more_information',
      color: '#ffc107'
    },
    {
      status: 'Unclear',
      color: '#ffc107'
    },
    {
      status: 'Closed',
      color: '#FF0000'
    },
  ]

  const [anchorElStatus, setAnchorElStatus] = React.useState(null);

  const handleClickStatus = (event) => {
    setAnchorElStatus(event.currentTarget);
  };

  const handleCloseStatus = () => {
    setAnchorElStatus(null);
  };

  const [status, setStatus] = React.useState({
    status: props.status,
    color: getStatusColor(props.status)
  });

  const updateStatus = (status) => {
    Axios.patch(`http://127.0.0.1:8000/api/issues/${props.id}/`, { status: status })
      .then(res => {
        let audio = new Audio('../sounds/navigation_selection-complete-celebration.wav');
        audio.play();
        setTimeout(() => {
          console.log(res.data);
          setStatus({
            status: status,
            color: getStatusColor(status)
          });
        }, 1000);
      })
      .catch(err => {
        console.log(err);
        let audio = new Audio('../sounds/alert_error-03.wav');
        audio.play();
      });
  }

  return (
    <div>
      <div
        className="project-issue-details"
        style={{
          ...projectDetails,
          textTransform: 'none'
        }}
        onClick={handleClickOpen}
      >
        <div
          className="project-issue-details-left"
          style={projectDetailsLeftRight}
        >
          <div
            className="project-issue-status"
            onClick="event.stopPropagation()"
          >
            <Button
              variant="outlined"
              style={{
                borderRadius: '10px',
                textTransform: 'none'
              }}
              className="issue-button-filled"
            >
              <div className="project-issue-tag-icon" style={{ backgroundColor: status.color, boxShadow: '0 0 5px ' + status.color }}></div>
              {status.status}
            </Button>
          </div>
          <div className="project-issue-date" style={{ fontSize: '15px' }}>
            {new Date(props.date).getDate() + "/" + (new Date(props.date).getMonth() + 1) + "/" + new Date(props.date).getFullYear()}
          </div>
          <span style={{ marginRight: '10px' }}>•</span>
          <div className="project-issue" style={{ marginRight: '10px', whiteSpace: 'nowrap' }}>
            {props.title}
          </div>
          {props.showProjectNameOnCard &&
            <>
              <span style={{ marginRight: '10px' }}>•</span>
              <div className="project-issue" style={{ marginRight: '10px' }}>
                {props.projectname}
              </div>
            </>
          }
        </div>
        {isMobile && <br />}
        <div className="project-issue-details-right" style={projectDetailsLeftRight}>
          <div className="project-issue-tags">
            {
              props.tags.map(tag => (
                <Button
                  onClick="event.stopPropagation()"
                  className="project-issue-tag issue-button-filled"
                  variant="outlined"
                  style={{
                    borderRadius: '10px',
                    textTransform: 'none',
                    marginRight: "5px"
                  }}
                >
                  <div
                    className="project-issue-tag-icon"
                    style={{
                      backgroundColor: props.tagNameColorList[tag].tagColor,
                      boxShadow: '0 0 5px ' + props.tagNameColorList[tag].tagColor
                    }}
                  />
                  <span className='issue-tag-text'>{props.tagNameColorList[tag].tagText}</span>
                </Button>
              ))
            }
          </div>
          <Link to={issueUsers.reporter && '/users/' + issueUsers.reporter.enrollment_number}>
            <Button
              onClick="event.stopPropagation()"
              variant="outlined" className="project-issue-reporter issue-button-filled"
              style={{
                borderRadius: '10px', textTransform: 'none', whiteSpace: 'nowrap'
              }}
            >
              <div className="project-issue-reported-by-image">
                <img src={issueUsers.reporter.display_picture ? issueUsers.reporter.display_picture : "../sunglasses.svg"} alt="Issue Reporter" />
              </div>
              {issueUsers.reporter.name && issueUsers.reporter.name}
            </Button>
          </Link>
        </div>
      </div>


      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        TransitionComponent={Transition}
        className={!isMobile ? "modal-rounded" : null}
      >
        <DialogTitle id="responsive-dialog-title" className="modal-title-issue">
          <div>
            <IconButton>
              <CloseRoundedIcon onClick={handleClose} />
            </IconButton>
            {props.projectname} • Issue {!props.showProjectNameOnCard && props.issueIndex}
          </div>
          {
            issueUsers.reporter.id == props.currentUser &&
            <div>
              <IconButton
                style={{ backgroundColor: "#f4433630", marginLeft: "5px" }}
                onClick={handleIssueDelete}
                size="small"
              >
                <DeleteOutlineOutlinedIcon color="error" />
              </IconButton>
            </div>
          }

        </DialogTitle>
        <DialogContent style={{ padding: "5px 10px" }}>
          <div className="issue-container" style={issueContainer}>
            <div className="issue-section">
              <div className="issue-detail">
                <div>
                  <Button
                    variant="outlined"
                    className="project-reporter issue-button-filled"
                    style={{
                      borderRadius: '10px',
                      textTransform: 'none',
                      width: 'fit-content',
                      alignSelf: 'flex-start',
                      marginBottom: '10px'
                    }}
                    onClick={handleClickStatus}
                  >
                    <div className="project-issue-tag-icon" style={{ backgroundColor: status.color, boxShadow: '0 0 5px ' + status.color, marginRight: '5px' }}></div>
                    {status.status}
                  </Button>
                  <Menu
                    anchorEl={anchorElStatus}
                    keepMounted
                    open={Boolean(anchorElStatus)}
                    onClose={handleCloseStatus}
                    style={{ marginTop: '50px' }}
                  >
                    {
                      statusList.map(statusItem =>
                        <MenuItem onClick={() => {
                          handleCloseStatus();
                          updateStatus(statusItem.status);
                        }}>
                          <div
                            className="project-issue-tag-icon"
                            style={{
                              backgroundColor: statusItem.color,
                              boxShadow: '0 0 5px ' + statusItem.color,
                              marginRight: '5px'
                            }}>
                          </div>
                          {statusItem.status}
                        </MenuItem>
                      )
                    }
                  </Menu>
                </div>
                <div className="issue-buttons">
                  <Link to={issueUsers.reporter && '/users/' + issueUsers.reporter.enrollment_number}>
                    <Button
                      onClick="event.stopPropagation()"
                      variant="outlined"
                      className="project-issue-reporter issue-button-filled"
                      style={{
                        borderRadius: '10px',
                        textTransform: 'none',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <div className="project-issue-reported-by-image">
                        <img src={issueUsers.reporter.display_picture ? issueUsers.reporter.display_picture : "../sunglasses.svg"} alt="Issue Reporter" />
                      </div>
                      &nbsp;
                      {issueUsers.reporter.name && issueUsers.reporter.name}
                    </Button>&nbsp;&nbsp;
                  </Link>

                  <div className="project-issue-tags issue-tag-text">
                    {
                      props.tags.map((tag) => (
                        <Button
                          className="project-issue-tag issue-button-filled"
                          variant="outlined"
                          style={{
                            borderRadius: '10px',
                            textTransform: 'none',
                            marginRight: "5px"
                          }}
                        >
                          <div className="project-issue-tag-icon" style={{ backgroundColor: props.tagNameColorList[tag].tagColor, boxShadow: '0 0 5px ' + props.tagNameColorList[tag].tagColor }}></div>&nbsp;
                          {props.tagNameColorList[tag].tagText}
                        </Button>
                      ))
                    }
                  </div>
                </div>

                <div className="issue-heading">
                  {props.title}
                </div>

                <div className="issue-date">
                  {new Date(props.date).getDate() + "/" + (new Date(props.date).getMonth() + 1) + "/" + new Date(props.date).getFullYear()}
                </div>

                <div className="issue-content">
                  <DraftailEditor
                    editorState={editorState}
                    topToolbar={null}
                    style={{ color: 'darkgray', backgroundColor: '#00000000' }}
                  />
                </div>

                <div className="issue-images-container">
                  <div className="issue-image">
                    {props.image && <ImageWithModal src={props.image.image} alt="Issue" />}
                  </div>
                </div>

                <div className="issue-assigned-to">
                  Assigned to: &nbsp;
                  {
                    issueUsers.assignee.enrollment_number ?
                      <Link to={issueUsers.assignee && '/users/' + issueUsers.assignee.enrollment_number}>
                        <Button
                          onClick="event.stopPropagation()"
                          variant="outlined"
                          className="project-issue-reporter issue-button-filled"
                          style={{
                            borderRadius: '10px',
                            textTransform: 'none'
                          }}
                        >
                          <div className="project-issue-reported-by-image">
                            <img src={issueUsers.assignee.display_picture ? issueUsers.assignee.display_picture : "../sunglasses.svg"} alt="Issue Reporter" />
                          </div>
                      &nbsp;
                      {issueUsers.assignee && issueUsers.assignee.name}
                        </Button>
                      </Link>
                      :
                      <span>None</span>
                  }
                </div>
              </div>
            </div>
            <div className="comments-section">
              <div className="comments-header">
                Comments
            </div>
              <div className="comments-container">



                {comments && comments.map(comment => {
                  let date;
                  if (new Date(comment.timestamp).getMinutes() > 9) {
                    date = new Date(comment.timestamp).getHours() + ":" + new Date(comment.timestamp).getMinutes() + " • " + new Date(comment.timestamp).getDate() + "/" + (new Date(comment.timestamp).getMonth() + 1) + "/" + new Date(comment.timestamp).getFullYear()
                  } else {
                    date = new Date(comment.timestamp).getHours() + ":" + "0" + new Date(comment.timestamp).getMinutes() + " • " + new Date(comment.timestamp).getDate() + "/" + (new Date(comment.timestamp).getMonth() + 1) + "/" + new Date(comment.timestamp).getFullYear()
                  }
                  let isSentByCurrentUser = comment.commentor == props.currentUser;
                  let commentClass = isSentByCurrentUser ? "comment comment-sent" : "comment comment-recieved";
                  return (
                    <div className={commentClass}>
                      <div className="comment-sender">
                        {props.userNameList && props.userNameList[comment.commentor]}
                      </div>
                      <div className="comment-content">
                        {comment.text}
                      </div>
                      <div className="comment-bottom">
                        {
                          isSentByCurrentUser ?
                            <div>
                              <IconButton
                                onClick={() => { handleCommentDelete(comment.id) }}
                                size="small"
                                style={{
                                  backgroundColor: "#f4433630",
                                  marginLeft: "5px"
                                }}
                              >
                                <DeleteOutlineOutlinedIcon color="error" />
                              </IconButton>
                            </div>
                            :
                            <div></div>
                        }
                        <div>
                          {date}
                        </div>
                      </div>


                    </div>
                  )
                })}


              </div>


              <div className="comment-write-form" style={{ textAlign: "center" }}>
                <form
                  onSubmit={handleCommentSubmit}
                  autoComplete="off"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-evenly"
                  }}
                >
                  <Input
                    type="text"
                    value={newComment.text}
                    name="text"
                    onChange={handleNewComment}
                    placeholder="Type a comment..."
                    style={{
                      width: "75%",
                      margin: "10px",
                      backgroundColor: "#7d7d7d42",
                      padding: "10px",
                      borderRadius: "14px"
                    }}>
                  </Input>
                  <Tooltip title="Send" placement="bottom">
                    <Button
                      type="submit"
                      onClick={handleCommentSubmit}
                      name="commentSendButton"
                      style={{ borderRadius: "10px" }}
                    >
                      <SendRoundedIcon style={{ fontSize: "30px" }} />
                    </Button>
                  </Tooltip>

                </form>
              </div>
            </div>

          </div>


        </DialogContent>
      </Dialog>
    </div>
  );
}
