import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import BugReportRoundedIcon from '@material-ui/icons/BugReportRounded';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';

import { connect } from "react-redux";
import { NavLink, Redirect } from 'react-router-dom';
import * as actions from '../store/actions/auth';

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    height: '500px',
    width: 'auto',
    margin: 'auto',
    top: '0',
    bottom: '0',
    right: '0',
    left: '0',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    height: theme.spacing(7),
    width: theme.spacing(7)
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Signin = (props) => {
  const classes = useStyles();

  let errorMessage = props.error ? <p style={{ color: "#ff6b6b", textAlign: "center" }}>Sign in failed. Try again.</p> : null;

  return (
    <>
      {


        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            {/* <a href='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>
              <img src='./bugmeme.jpeg' style={{ borderRadius: '10px', height: '200px', margin: '60px' }} />
            </a> */}
            <Typography style={{textAlign: 'center', margin: '30px'}}>"Don't need to debug code,<br />if you don't write bugs."<br />👉🧠👈</Typography>
            <Avatar className={classes.avatar}>
              <BugReportRoundedIcon style={{ fontSize: "40px" }} />
            </Avatar>
            <Typography component="h1" variant="h5">
              Welcome to Pesticide
          </Typography>
            {/* <Typography >{errorMessage}</Typography> */}
            <a href='https://internet.channeli.in/oauth/authorise/?client_id=gKUvZEAlIemSbCql1JzDkR2ClVBY6MjGehIyqeeY&redirect_url=http://localhost:3000/onlogin/&state=foobarbaz42'>
              <Button
                fullWidth
                variant="contained"
                color="default"
                startIcon={<img src='./omniport.png' style={{ width: '35px', margin: '0 10px' }} />}
                className={classes.submit}
              >
                Sign in with Omniport
            </Button>
            </a>
            <a href='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<img src='./imglogo.png' style={{ width: '35px', margin: '0 10px' }} />}
                className={classes.submit}
              >
                Not in IMG?
            </Button>
            </a>
          </div>
        </Container>

      }
    </>
  );
}

// const mapStateToProps = (state) => {
//   return {
//       loading: state.loading,
//       error: state.error
//   }
// }

// const mapDispatchToProps = (dispatch) => {
//   return {
//       onAuth: (username, password) => dispatch(actions.authLogin(username, password))
//   }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(Signin);
export default Signin;