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
import { IconButton } from '@material-ui/core';
import Slide from '@material-ui/core/Slide';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import CreateNewFolderOutlinedIcon from '@material-ui/icons/CreateNewFolderOutlined';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import NewIssueForm from './NewIssueForm';


const isMobile = window.innerWidth < 850;

const statusList = ["❌ Closed", "🔵 Open", "✔️ Fixed"];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export default function NewIssueWithModal(props) {
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

        {
            props.floating 

            ? 

            <Fab 
                onClick={handleClickOpen} 
                color="secondary" 
                style={{position: "absolute", bottom: "30px", right: "30px", zIndex: 1200}}
            >
                <AddIcon />
            </Fab>

            :

            <Button
                startIcon={<AddRoundedIcon />}
                variant="outlined"
                style={{ textTransform: "none", margin: "0 5px" }}
                onClick={handleClickOpen}
            >
                Add
            </Button>

        }
  

        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
          TransitionComponent={Transition}
          className={!isMobile ? "modal-rounded" : null}
        >

            <DialogTitle 
                id="responsive-dialog-title" 
                className="modal-title"
            >
                <IconButton>
                    <CloseRoundedIcon onClick={handleClose}/>
                </IconButton>

                    {props.projectname} • New Issue

            </DialogTitle>

            <DialogContent style={{padding: "5px 10px"}}>
                <NewIssueForm 
                    project={props.project} 
                    handleClose={handleClose}
                    getIssues={props.getIssues}
                />
            </DialogContent>

        </Dialog>


    </div>
  );
}
