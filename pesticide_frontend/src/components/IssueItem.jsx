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
import Menu from '@material-ui/core/Menu';
import Skeleton from '@material-ui/lab/Skeleton';

import { Link } from 'react-router-dom';

import { EditorState } from 'draft-js';
import { DraftailEditor, BLOCK_TYPE, INLINE_STYLE, ENTITY_TYPE } from 'draftail';
import { stateFromHTML } from 'draft-js-import-html';

import ImageWithModal from './ImageWithModal';
import SkeletonIssue from './SkeletonIssue';
import * as api_links from '../APILinks';
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
  // const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const fullScreen = useMediaQuery('(max-width: 900px)');
  // const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isMobile = useMediaQuery('(max-width: 700px)');

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
      Axios.post(api_links.API_ROOT + 'comments/', newComment)
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
    c1 && Axios.delete(api_links.API_ROOT + `comments/${commentID}/`)
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
    c2 && Axios.delete(api_links.API_ROOT + `issues/${props.id}/`)
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
    Axios.get(api_links.API_ROOT + `users/${props.reporterId}`)
      .then(res => {
        setIssueUsers(prev => ({
          ...prev,
          reporter: res.data
        }));
      })
      .catch(err => console.log(err));

    props.assigneeId && Axios.get(api_links.API_ROOT + `users/${props.assigneeId}`)
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
        return ('#7bb240');
        break;
      case 'Not_a_bug':
        return ('#FF0000');
        break;
      case 'Needs_more_information':
        return ('#cc9900');
        break;
      case 'Unclear':
        return ('#cc9900');
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
      color: '#7bb240'
    },
    {
      status: 'Not_a_bug',
      color: '#FF0000'
    },
    {
      status: 'Needs_more_information',
      color: '#cc9900'
    },
    {
      status: 'Unclear',
      color: '#cc9900'
    },
    {
      status: 'Closed',
      color: '#FF0000'
    },
  ];

  const getStatusEmoji = (status) => {
    switch (status) {
      case 'Open':
        return "🆕";
      case 'Fixed':
        return "✔️";
      case 'Not_a_bug':
        return "⁉️";
      case 'Needs_more_information':
        return "🤔";
      case 'Unclear':
        return "🤔";
      case 'Closed':
        return "❌";
    }
  }

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
    Axios.patch(api_links.API_ROOT + `issues/${props.id}/`, { status: status })
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

  return (
    <div>
      {
        issueUsers.reporter.name == undefined &&
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
                color: status.color,
                fontWeight: '700'
              }}
              className="issue-button-filled"
            >
              {/* <div className="project-issue-tag-icon" style={{ backgroundColor: status.color, boxShadow: '0 0 5px ' + status.color, marginRight: '3px' }}></div> */}
              {/* {getStatusEmoji(status.status)} */}
              {!fullScreen ? getStatusEmoji(status.status) + " " + status.status : status.status.length < 9 ? (getStatusEmoji(status.status) + " " + status.status) : (getStatusEmoji(status.status) + " " + status.status.slice(0, 8) + "...")}
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
                  new Date(props.date).getDate() + " " + monthList[new Date(props.date).getMonth()]
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
                    color: props.tagNameColorList[tag].tagColor,
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
                  <span className='issue-tag-text'>{props.tagNameColorList[tag].tagText}</span>
                  </div>

                </Button>
              ))
            }
            {
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
                  {issueUsers.reporter.name != undefined && (!isMobile ? issueUsers.reporter.name : issueUsers.reporter.name.split(" ")[0])}
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
        TransitionComponent={Transition}
        className={!isMobile ? "modal-rounded" : null}
      >
        <DialogTitle id="responsive-dialog-title" className="modal-title-issue">
          <div>
            <Button className="btn-filled-small btn-filled-bg-transparent">
              <CloseRoundedIcon onClick={handleClose} />
            </Button>
            {props.projectname} • Issue {!props.showProjectNameOnCard && props.issueIndex}
          </div>
          {
            issueUsers.reporter.id == props.currentUser &&
            <div>
              <Button
                className="btn-filled-small btn-filled-small-error"
                onClick={handleIssueDelete}
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
                      color: status.color,
                      fontWeight: '700'
                    }}
                    onClick={handleClickStatus}
                  >
                    {getStatusEmoji(status.status) + " " + status.status}
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
                            style={{
                              color: statusItem.color,
                              fontWeight: '700'
                            }}
                          >
                            {getStatusEmoji(statusItem.status) + " " + statusItem.status}
                          </div>
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
                  {new Date(props.date).getDate() + " " + monthList[new Date(props.date).getMonth()] + " " + new Date(props.date).getFullYear()}
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
                    date = new Date(comment.timestamp).getHours() + ":" + new Date(comment.timestamp).getMinutes() + ", " + new Date(comment.timestamp).getDate() + " " + monthList[new Date(comment.timestamp).getMonth()] + " " + new Date(comment.timestamp).getFullYear()
                  } else {
                    date = new Date(comment.timestamp).getHours() + ":" + "0" + new Date(comment.timestamp).getMinutes() + ", " + new Date(comment.timestamp).getDate() + " " + monthList[new Date(comment.timestamp).getMonth()] + " " + new Date(comment.timestamp).getFullYear()
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
                              <Button
                                onClick={() => { handleCommentDelete(comment.id) }}
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
