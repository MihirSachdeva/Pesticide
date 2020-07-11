import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import BugReportRoundedIcon from '@material-ui/icons/BugReportRounded';

import * as api_links from '../APILinks';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '91.55vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    marginTop: '170px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '30px'
  },
}));

export default function SignInSide() {
  const classes = useStyles();

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <BugReportRoundedIcon style={{ fontSize: "40px" }} />
          </Avatar>
          <Typography component="h1" variant="h5">
            Welcome to Pesticide
          </Typography>
          <form className={classes.form} noValidate>
            <a href={api_links.OMNIPORT_OAUTH}>
              <Button
                variant="contained"
                color="default"
                startIcon={<img src='./omniport.png' style={{ width: '35px', margin: '0 10px' }} />}
                style={{textTransform: 'none'}}
              >
                Sign in with Omniport
            </Button>
            </a>
            <br />
            <a href={api_links.RICKROLLED}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<img src='./imglogo.png' style={{ width: '35px', margin: '0 10px' }} />}
                style={{textTransform: 'none'}}
              >
                Not in IMG?
            </Button>
            </a>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}