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

  const [comments, setComments] = React.useState();

  const [newComment, setNewComment] = React.useState({
    text: "",
    timestamp: new Date(),
    issue: props.id,
  });

  const [status, setStatus] = React.useState();

  React.useEffect(() => {
    setComments(props.comments);
    setNewComment({
      text: "",
      timestamp: new Date(),
      issue: props.id,
    });
    setStatus({
      text: props.statusText,
      type: props.statusType,
      color: props.statusColor,
      id: props.statusId
    });
  },[props.id]);

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    if (newComment.text != "") {
      const token = localStorage.getItem('token');
      Axios.defaults.headers = {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + token
      }
      let commentToBeSent = newComment;
      commentToBeSent.issue = props.id;
      Axios.post(api_links.API_ROOT + 'comments/', commentToBeSent)
        .then(res => {
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
        // setTimeout(() => {
          props.getIssues();
          setOpen(false);
        // }, 1000);
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

  const updateStatus = (text, type, color, id) => {
    Axios.patch(api_links.API_ROOT + `issues/${props.id}/`, { status: id })
      .then(res => {
        let audio = new Audio('../sounds/navigation_selection-complete-celebration.wav');
        audio.play();
        setTimeout(() => {
          setStatus({
            text: text,
            color: color,
            type: type,
            id: id
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
        return '#313131';
      case 'palpatine':
        return '#141414';
      case 'solarizedLight':
        return '#c1bdae';
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
        TransitionComponent={Transition}
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
             props.reporterDetails.id == props.currentUser &&
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
                      color: status && status.color,
                      fontWeight: '700'
                    }}
                    onClick={handleClickStatus}
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
                          updateStatus(statusItem.text, statusItem.type, statusItem.color, statusItem.id);
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
                     props.assigneeDetails.enrollment_number ?
                      <Link to={ '/users/' + props.assigneeDetails.enrollment_number}>
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
                            <img src={ props.assigneeDetails.display_picture ? props.assigneeDetails.display_picture : "../sunglasses.svg"} alt="Issue Reporter" />
                          </div>
                      &nbsp;
                      { props.assigneeDetails.name}
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
                    date = new Date(comment.timestamp).getHours() + ":" + new Date(comment.timestamp).getMinutes() + " • " + monthList[new Date(comment.timestamp).getMonth()] + " " + new Date(comment.timestamp).getDate() + ", " + new Date(comment.timestamp).getFullYear()
                  } else {
                    date = new Date(comment.timestamp).getHours() + ":" + "0" + new Date(comment.timestamp).getMinutes() + " • " + monthList[new Date(comment.timestamp).getMonth()] + " " + new Date(comment.timestamp).getDate() + ", " + new Date(comment.timestamp).getFullYear()
                  }
                  let isSentByCurrentUser = comment.commentor == props.currentUser;
                  let commentClass = isSentByCurrentUser ? "comment comment-sent" : "comment comment-recieved";
                  let commentAfterClass = isSentByCurrentUser ? "comment comment-sent-after" : "comment comment-recieved-after";
                  return (
                    <div className={commentClass}>
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
                        <div className={commentAfterClass} style={{ backgroundColor: commentAfterBgColor  }}/>
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


        </DialogContent>
      </Dialog>
    </div>
  );
}
