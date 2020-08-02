import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Input from '@material-ui/core/Input';
import { useTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import Slide from '@material-ui/core/Slide';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import CreateNewFolderRoundedIcon from '@material-ui/icons/CreateNewFolderRounded';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import Grow from '@material-ui/core/Grow';

import NewProjectForm from './NewProjectForm';

const isMobile = window.innerWidth < 850;


const projectDetails = {
  display: 'flex',
  flexDirection: isMobile ? 'column' : 'row',
  justifyContent: isMobile ? 'flex-start' : 'space-between',
  minWidth: '500px'
}

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



const statusList = ["❌ Closed", "🔵 Open", "✔️ Fixed"];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export default function NewProjectWithModal(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };



  return (
    <div>

      <Tooltip title={!props.open ? "New project" : ""} placement="right" className="drawer-btn-filled">
        <ListItem button onClick={handleClickOpen}>
          <ListItemIcon>
            <div className="drawer-project-icon-container">
              <CreateNewFolderRoundedIcon />
            </div>
          </ListItemIcon>
          <ListItemText primary="New project" />
        </ListItem>
      </Tooltip>


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
        maxWidth="xl"
      >
        <DialogTitle id="responsive-dialog-title" className="modal-title">
          <Button className="btn-filled-small btn-filled-bg-transparent" onClick={handleClose}>
            <CloseRoundedIcon />
          </Button>
                Create New Project
            </DialogTitle>

        <DialogContent style={{ padding: "5px 10px" }}>
          <NewProjectForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}
