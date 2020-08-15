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
import { IconButton, MenuItem, Typography } from '@material-ui/core';
import Slide from '@material-ui/core/Slide';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import Menu from '@material-ui/core/Menu';
import Grow from '@material-ui/core/Grow';

import { Link } from 'react-router-dom';

import { EditorState } from 'draft-js';
import { DraftailEditor, BLOCK_TYPE, INLINE_STYLE, ENTITY_TYPE } from 'draftail';
import { stateFromHTML } from 'draft-js-import-html';

import ImageWithModal from './ImageWithModal';
import SkeletonIssue from './SkeletonIssue';
import * as api_links from '../APILinks';
import WebSocketInstance from '../websocket';
import AlertDialog from './AlertDialog';
import Axios from 'axios';


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
  const [alert, setAlert] = React.useState({
    open: false
  });
  const theme = useTheme();
  const fullScreen = useMediaQuery('(max-width: 900px)');
  const isMobile = useMediaQuery('(max-width: 700px)');

  const commentsEndRef = React.useRef(null);

  const waitForSocketConnection = (callback) => {
    setTimeout(() => {
      if (WebSocketInstance.state() === 1) {
        console.log("Connection is secure.");
        callback();
        return;
      } else {
        console.log("Waiting for connection...");
        waitForSocketConnection(callback);
      }
    }, 100);
  };

  const setEmComments = (comments) => {
    setComments(comments);
  };

  const addComment = (comment) => {
    setComments((existingComments) => [...existingComments, comment]);
  };

  const removeComment = (commentId) => {
    setComments((existingComments) =>
      existingComments.filter((comment) => comment.id != commentId)
    );
  };

  const handleClickOpen = () => {
    // let audio = new Audio('../sounds/navigation_transition-right.wav');
    // audio.play();
    setOpen(true);
    WebSocketInstance.connect(props.id);
    waitForSocketConnection(() => {
      WebSocketInstance.addCallbacks(setEmComments, addComment, removeComment);
      WebSocketInstance.fetchComments(props.id);
    });
  };

  const handleClose = () => {
    // let audio = new Audio('../sounds/navigation_transition-left.wav');
    // audio.play();
    setOpen(false);
    WebSocketInstance.disconnect();
  };

  const projectDetails = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: isMobile ? 'flex-start' : 'space-between',
  }

  let contentState = stateFromHTML(props.content)

  const [editorState, setEditorState] = React.useState(EditorState.createWithContent(contentState));

  const [comments, setComments] = React.useState([]);

  const [newComment, setNewComment] = React.useState({
    text: "",
    issue: props.id,
  });

  const [status, setStatus] = React.useState();

  const [assignee, setAssignee] = React.useState(props.assigneeDetails);

  const handleIssueAssign = (data) => {
    Axios.patch(api_links.ASSIGN_ISSUE(props.id), { assigned_to: data.id })
      .then(res => {
        let audio = new Audio('../sounds/navigation_selection-complete-celebration.wav');
        audio.play();
        setTimeout(() => {
          setAssignee({
            id: data.id,
            name: data.name, 
            display_picture: data.display_picture, 
            enrollment_number: data.enrollment_number
          });
          props.getIssues();
        }, 1000);
      })
      .catch(err => {
        console.log(err);
        let audio = new Audio('../sounds/alert_error-03.wav');
        audio.play();
      });
  }

  const [usersForIssueAssign, setUsersForIssueAssign] = React.useState({
    project_members: [],
    other_users: []
  });

  const [projectMembersIdList, setProjectMembersIdList] = React.useState([]);

  async function fetchUsersListForIssueAssign(id) {
    Axios.get(`${api_links.API_ROOT}project_members/${id}/`)
      .then(res => {
        setUsersForIssueAssign({
          project_members: res.data.project_members,
          other_users: res.data.other_users
        });
        setProjectMembersIdList(res.data.project_members.map(member => member.id))
      })
      .catch(err => console.log(err));
  }

  React.useEffect(() => {
    setAlert({
      open: false
    });
    setNewComment({
      text: "",
      issue: props.id,
    });
    setStatus({
      text: props.statusText,
      type: props.statusType,
      color: props.statusColor,
      id: props.statusId
    });
    fetchUsersListForIssueAssign(props.project);
  },[props.id]);

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    if (newComment.text != "") {
      const commentObject = {
        ...newComment,
        commentor: props.currentUser.id
      };
      WebSocketInstance.newChatComment(commentObject);
      WebSocketInstance.fetchComments(props.id);
      setNewComment(prev => ({
        ...prev,
        text: ""
      }));  
      scrollToBottom();
    } else {
      let audio = new Audio('../sounds/alert_error-03.wav');
      audio.play();
    }
  }

  const handleNewComment = (event) => {
    const text = event.target.value;
    setNewComment(prevNewCommentState => ({
      ...prevNewCommentState,
      text: text
    }));
  }

  const scrollToBottom = () => {
    commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const openAlert = (action, title, description, cancel, confirm, data) => {
    setAlert({
      open: true,
      title,
      description,
      cancel,
      confirm,
      action,
      data
    });
  };

  const closeAlert = () => {
    setAlert(prevAlertState => ({
      open: false
    }));
  };

  const confirmAlert = (action, choice, data) => {
    switch (action) {
      case 'delete_comment':
        choice && handleCommentDelete(data);
        break;
      case 'delete_issue':
        choice && handleIssueDelete();
        break;
      case 'assign_issue':
        choice && handleIssueAssign(data);
        break;
      case 'update_issue_status':
        choice && handleIssueStatusUpdate(data);
        break;
      }
  }

  const handleCommentDelete = (commentID) => {
    // const token = localStorage.getItem('token');
    // Axios.defaults.headers = {
    //   'Content-Type': 'application/json',
    //   Authorization: 'Token ' + token
    // }
    // let c1 = window.confirm("This comment will be deleted permanently. Are you sure?");
    // c1 && Axios.delete(api_links.API_ROOT + `comments/${commentID}/`)
    //   .then(res => {
    //     setComments(prevComments => prevComments.filter(comment => comment.id !== commentID));
    //     let audio = new Audio('../sounds/ui_refresh-feed.wav');
    //     audio.play();
    //   })
    //   .catch(err => console.log(err));
    WebSocketInstance.deleteComment(commentID);
    // WebSocketInstance.fetchComments(props.id);
  }

  const handleIssueDelete = () => {
    const token = localStorage.getItem('token');
    Axios.defaults.headers = {
      'Content-Type': 'application/json',
      Authorization: 'Token ' + token
    }
    Axios.delete(api_links.API_ROOT + `issues/${props.id}/`)
      .then(res => {
        let audio = new Audio('../sounds/ui_refresh-feed.wav');
        audio.play();
        props.getIssues();
        handleClose();
      })
      .catch(err => console.log(err));
  }

  const [anchorElStatus, setAnchorElStatus] = React.useState(null);

  const handleClickStatus = (event) => {
    setAnchorElStatus(event.currentTarget);
  };

  const handleCloseStatus = () => {
    setAnchorElStatus(null);
  };

  const [anchorElUsers, setAnchorElUsers] = React.useState(null);

  const handleClickUsers = (event) => {
    setAnchorElUsers(event.currentTarget);
  };

  const handleCloseUsers = () => {
    setAnchorElUsers(null);
  };

  const handleIssueStatusUpdate = (data) => {
    Axios.patch(api_links.UPDATE_ISSUE_STATUS(props.id), { status: data.id })
      .then(res => {
        let audio = new Audio('../sounds/navigation_selection-complete-celebration.wav');
        audio.play();
        setTimeout(() => {
          setStatus({
            text: data.text,
            color: data.color,
            type: data.type,
            id: data.id
          });
          props.getIssues();
        }, 1000);
      })
      .catch(err => {
        console.log(err);
        let audio = new Audio('../sounds/alert_error-03.wav');
        audio.play();
      });
  }

  const monthList = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec"
  ];

  const commentAfterBgColor = ((theme) => {
    switch(theme) {
      case 'light':
        return '#d2d2d2';
      case 'dark':
        return '#1b1c1e';
      case 'palpatine':
        return '#141414';
      case 'solarizedLight':
        return '#cec8b4';
      case 'solarizedDark':
        return '#092129';
      default:
        return '#d2d2d2';
    }
  })(localStorage.getItem('theme') || 'light');

  return (
    <div>
      {
         props.reporterDetails.name == undefined &&
        <SkeletonIssue />
      }
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
                textTransform: 'none',
                marginRight: '5px',
                color: status && status.color,
                fontWeight: '700'
              }}
              className="issue-button-filled"
            >
              {status && (!fullScreen ? status.text : status.text.length < 9 ? status.text : status.text.slice(0, 8) + "...")}
            </Button>
          </div>
          <Typography className="project-issue" style={{ whiteSpace: 'nowrap', fontWeight: '600' }}>
            {!fullScreen ? props.title : props.title.length < 15 ? props.title : props.title.slice(0, 14) + "..."}
          </Typography>
          {props.showProjectNameOnCard
            ?
            <>
              <Typography style={{ margin: '0 5px', fontSize: '27px' }}>•</Typography>
              <Typography className="project-issue">
                {props.projectname}
              </Typography>
            </>
            :
            <>
              <Typography style={{ margin: '0 5px', fontSize: '27px' }}>•</Typography>
              <Typography className="project-issue-date" style={{ fontSize: '15px', whiteSpace: 'nowrap' }}>
                {
                  monthList[new Date(props.date).getMonth()] + " " + new Date(props.date).getDate()
                }
              </Typography>
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
                    marginRight: "5px",
                    color: props.tagNameColorList && props.tagNameColorList[tag].tagColor,
                    fontWeight: '900'
                  }}
                >
                  {/* <div
                    className="project-issue-tag-icon"
                    style={{
                      backgroundColor: props.tagNameColorList[tag].tagColor,
                      boxShadow: '0 0 5px ' + props.tagNameColorList[tag].tagColor
                    }}
                  /> */}
                  <div>
                    #
                  <span className='issue-tag-text'>{props.tagNameColorList && props.tagNameColorList[tag].tagText}</span>
                  </div>

                </Button>
              ))
            }
            {
              <Link to={'/users/' + props.reporterDetails.enrollment_number}>
                <Button
                  onClick="event.stopPropagation()"
                  variant="outlined" className="project-issue-reporter issue-button-filled"
                  style={{
                    borderRadius: '10px', textTransform: 'none', whiteSpace: 'nowrap'
                  }}
                >
                  <div className="project-issue-reported-by-image">
                    <img src={props.reporterDetails.display_picture ? props.reporterDetails.display_picture : "../sunglasses.svg"} alt="Issue Reporter" />
                  </div>
                  {props.reporterDetails.name != undefined && (!isMobile ? props.reporterDetails.name : props.reporterDetails.name.split(" ")[0])}
                </Button>
              </Link>
            }
          </div>
        </div>
      </div>


      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        TransitionComponent={Grow}
        transitionDuration={{
          enter: 100,
          exit: 100,
        }}
        className={!isMobile ? "modal-rounded" : null}
      >
        <DialogTitle id="responsive-dialog-title" className="modal-title-issue">
          <div>
            <Button className="btn-filled-small btn-filled-bg-transparent" onClick={handleClose}>
              <CloseRoundedIcon />
            </Button>
            {props.projectname} • Issue {!props.showProjectNameOnCard && props.issueIndex}
          </div>
          {
             (props.reporterDetails.id == props.currentUser.id || props.currentUser.is_master || projectMembersIdList.includes(props.currentUser.id)) &&
            <div>
              <Button
                className="btn-filled-small btn-filled-small-error"
                onClick={() => { openAlert(
                  'delete_issue', 
                  'Delete this Issue?', 
                  "This issue, and all it's comments will be deleted permanently.", 
                  'Cancel', 
                  'Delete',
                  props.id
                ) }}
                size="small"
              >
                <DeleteOutlineOutlinedIcon color="error" />
              </Button>
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
                      marginBottom: '10px',
                      color: status && status.color,
                      fontWeight: '700'
                    }}
                    onClick={(props.currentUser.is_master || projectMembersIdList.includes(props.currentUser.id)) && handleClickStatus}
                  >
                    {status && status.text}
                  </Button>
                  <Menu
                    anchorEl={anchorElStatus}
                    keepMounted
                    open={Boolean(anchorElStatus)}
                    onClose={handleCloseStatus}
                    style={{ marginTop: '50px' }}
                  >
                    {
                      props.statusList.map(statusItem =>
                        <MenuItem onClick={() => {
                          handleCloseStatus();
                          statusItem.id != status.id && openAlert(
                            'update_issue_status', 
                            `Update issue's status to ${statusItem.text}?`, 
                            'All the project members will get an email notification for the same', 
                            'Cancel', 
                            'Update',
                            {
                              text: statusItem.text, 
                              type: statusItem.type, 
                              color: statusItem.color, 
                              id: statusItem.id
                            }
                          )
                        }}>
                          <div
                            style={{
                              color: statusItem.color,
                              fontWeight: '700'
                            }}
                          >
                            {statusItem.text}
                          </div>
                        </MenuItem>
                      )
                    }
                  </Menu>
                </div>
                <div className="issue-buttons">
                  <Link to={ '/users/' + props.reporterDetails.enrollment_number} className="issue-reporter-link">
                    <Button
                      variant="outlined"
                      className="project-issue-reporter issue-button-filled"
                      style={{
                        borderRadius: '10px',
                        textTransform: 'none',
                        whiteSpace: 'nowrap'
                      }}
                      onClick={() => setOpen(!open)}
                    >
                      <div className="project-issue-reported-by-image">
                        <img src={ props.reporterDetails.display_picture ? props.reporterDetails.display_picture : "../sunglasses.svg"} alt="Issue Reporter" />
                      </div>
                      &nbsp;
                      { props.reporterDetails.name}
                    </Button>&nbsp;&nbsp;
                  </Link>

                  <div className="project-issue-tags issue-tag-text" style={{ marginTop: '10px' }}>
                    {
                      props.tags.map((tag) => (
                        <Button
                          className="project-issue-tag issue-button-filled"
                          variant="outlined"
                          style={{
                            borderRadius: '10px',
                            textTransform: 'none',
                            marginRight: "5px",
                            color: props.tagNameColorList[tag].tagColor,
                            fontWeight: '900'
                          }}
                        >
                          <div>
                            #
                          {props.tagNameColorList[tag].tagText}
                          </div>

                        </Button>
                      ))
                    }
                  </div>
                </div>

                <div className="issue-heading">
                  {props.title}
                </div>

                <div className="issue-date">
                  {monthList[new Date(props.date).getMonth()] + " " + new Date(props.date).getDate() + ", " + new Date(props.date).getFullYear()}
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
                    <>
                      {
                        assignee ?
                        <Link to={ '/users/' + assignee.enrollment_number}>
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
                              <img 
                                src={assignee.display_picture || "../sunglasses.svg"} 
                                alt="Issue Reporter" 
                              />
                            </div>
                            &nbsp;
                            { assignee.name }
                          </Button>
                        </Link>
                        :
                        <span>None</span>
                      }
                      <br />
                      {
                        (props.reporterDetails.id == props.currentUser.id || props.currentUser.is_master || projectMembersIdList.includes(props.currentUser.id)) &&
                        <div>
                          <Button
                            variant="outlined"
                            className="project-reporter issue-button-filled"
                            style={{
                              borderRadius: '10px',
                              textTransform: 'none',
                              width: 'fit-content',
                              alignSelf: 'flex-start',
                              marginBottom: '10px',
                              fontWeight: '700'
                            }}
                            onClick={(props.reporterDetails.id == props.currentUser.id || props.currentUser.is_master || projectMembersIdList.includes(props.currentUser.id)) && handleClickUsers}
                          >
                            <AssignmentIndIcon fontSize="small" style={{marginRight: "5px"}}/>
                            Assign
                          </Button>
                          <Menu
                            anchorEl={anchorElUsers}
                            keepMounted
                            open={Boolean(anchorElUsers)}
                            onClose={handleCloseUsers}
                            style={{ marginTop: '50px' }}
                          >
                            <div style={{margin: '0 10px'}}>Project Members</div>
                            {
                              usersForIssueAssign.project_members.map(user =>
                                <MenuItem 
                                  onClick={() => {
                                    handleCloseUsers();
                                    !(assignee && user.id == assignee.id) && openAlert(
                                      'assign_issue', 
                                      `Assign this issue to ${user.name}?`, 
                                      `${user.name} will get an email notification for the same.`, 
                                      'Cancel', 
                                      'Assign',
                                      {
                                        id: user.id,
                                        name: user.name,
                                        display_picture: user.display_picture,
                                        enrollment_number: user.enrollment_number
                                      }
                                    )
                                    // updateAssignee(
                                    //   user.id,
                                    //   user.name,
                                    //   user.display_picture,
                                    //   user.enrollment_number
                                    // );
                                  }}
                                >
                                  <div style={{display: 'flex'}}>
                                    <div className="project-issue-reported-by-image">
                                      <img
                                        src={user.display_picture || '../sunglasses.svg'}
                                        alt={user.name}
                                      />
                                    </div>
                                    <Typography style={{marginLeft: '10px'}}>{user.name}</Typography>
                                  </div>
                                </MenuItem>
                              )
                            }
                            <hr className="divider2" style={{margin: '0'}} />
                            <div style={{margin: '10px 10px 0 10px'}}>Other Users</div>
                            {
                              usersForIssueAssign.other_users.map(user =>
                                <MenuItem 
                                  onClick={() => {
                                    handleCloseUsers();
                                    !(assignee && user.id == assignee.id) && openAlert(
                                      'assign_issue', 
                                      `Assign this issue to ${user.name}?`, 
                                      `${user.name} will get an email notification for the same`, 
                                      'Cancel', 
                                      'Assign',
                                      {
                                        id: user.id,
                                        name: user.name,
                                        display_picture: user.display_picture,
                                        enrollment_number: user.enrollment_number
                                      }
                                    )
                                    // updateAssignee(
                                    //   user.id,
                                    //   user.name,
                                    //   user.display_picture,
                                    //   user.enrollment_number
                                    // );
                                  }}
                                >
                                  <div style={{display: 'flex'}}>
                                    <div className="project-issue-reported-by-image">
                                      <img
                                        src={user.display_picture || '../sunglasses.svg'}
                                        alt={user.name}
                                      />
                                    </div>&nbsp;
                                    <Typography style={{marginLeft: '10px'}}>{user.name}</Typography>
                                  </div>
                                </MenuItem>
                              )
                            }
                          </Menu>
                        </div>
                      }
                    </>
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
                    date = new Date(comment.timestamp).getHours() + ":" + new Date(comment.timestamp).getMinutes() + " • " + monthList[new Date(comment.timestamp).getMonth()] + " " + new Date(comment.timestamp).getDate() + ", " + new Date(comment.timestamp).getFullYear()
                  } else {
                    date = new Date(comment.timestamp).getHours() + ":" + "0" + new Date(comment.timestamp).getMinutes() + " • " + monthList[new Date(comment.timestamp).getMonth()] + " " + new Date(comment.timestamp).getDate() + ", " + new Date(comment.timestamp).getFullYear()
                  }
                  let isSentByCurrentUser = comment.commentor_details.id == props.currentUser.id;
                  let commentClass = isSentByCurrentUser ? "comment comment-sent" : "comment comment-recieved";
                  let commentAfterClass = isSentByCurrentUser ? "comment comment-sent-after" : "comment comment-recieved-after";
                  return (
                    <div className={commentClass} id={comment.id}>
                      <div className="comment-sender">
                        <div className="comment-sender-image">
                          <img src={comment.commentor_details.display_picture || '../sunglasses.svg'} alt="Commentor" className="commentor-img"/>
                        </div>
                        <Link to={`/users/${comment.commentor_details.enrollment_number}`}>
                          <Typography className="commentor-name">
                            {comment.commentor_details.name}
                          </Typography>
                        </Link>
                      </div>
                      <div className="comment-content">
                        {comment.text}
                      </div>
                      <div className="comment-bottom">
                        {
                          isSentByCurrentUser ?
                            <div>
                              <Button
                                onClick={() => { openAlert(
                                  'delete_comment', 
                                  'Delete this comment.', 
                                  'This comment will be deleted permanently.', 
                                  'Cancel', 
                                  'Delete',
                                  comment.id
                                ) }}
                                size="small"
                                style={{
                                  marginLeft: "5px"
                                }}
                                className="btn-filled-xs btn-filled-xs-error "
                              >
                                <DeleteOutlineOutlinedIcon color="error" />
                              </Button>
                            </div>
                            :
                            <div></div>
                        }
                        <div>
                          {date}
                        </div>
                        <div className={commentAfterClass} style={{ backgroundColor: commentAfterBgColor  }}/>
                      </div>


                    </div>
                  )
                })}

                <div ref={commentsEndRef}></div>

              </div>


              <div className="comment-write-form" style={{ textAlign: "center" }}>
                <form
                  onSubmit={handleCommentSubmit}
                  autoComplete="off"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: '18px'
                  }}
                >
                  <Input
                    type="text"
                    value={newComment.text}
                    name="text"
                    onChange={handleNewComment}
                    placeholder="Type a comment..."
                    className="comment-send-input"
                  >
                  </Input>
                  <Tooltip title="Send" placement="bottom">
                    <Button
                      type="submit"
                      onClick={handleCommentSubmit}
                      name="commentSendButton"
                      style={{ borderRadius: "4px", height: '38px', marginLeft: '20px' }}
                    >
                      <SendRoundedIcon style={{ fontSize: "30px" }} />
                    </Button>
                  </Tooltip>

                </form>
              </div>
            </div>

          </div>

          <AlertDialog 
            open={alert.open}
            action={alert.action}
            title={alert.title || ""}
            description={alert.description || ""}
            cancel={alert.cancel || ""}
            confirm={alert.confirm || ""}
            confirmAlert={confirmAlert}
            data={alert.data || {}}
            closeAlert={closeAlert}
          />

        </DialogContent>
      </Dialog>
    </div>
  );
}
