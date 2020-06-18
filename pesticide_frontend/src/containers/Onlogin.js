import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { connect } from "react-redux";
import { NavLink, Redirect, Link } from 'react-router-dom';
import { Typography } from "@material-ui/core";
import * as actions from '../store/actions/auth';

function Onlogin(props) {
  const [state, setState] = useState({
    user_found: false,
    got_response: false,
  });

  useEffect(() => {
    let url = props.location.search;
    let params = queryString.parse(url);
    console.log(params.code);

    axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/users/onlogin/',
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true,
      data: {
        code: params.code,
        state: params.state
      }
    })
      .then(res => {
        console.log(res);
        //set access token as token for user authentication
        if (res.status === 201 || res.status === 202) {
          setState({
            user_found: true,
            got_response: true,
          });
          props.onAuth(res.data.username, res.data.access_token);
          console.log("Logged in!")
        } else if (res.status === 401) {
          setState({
            user_found: false,
            got_response: true
          });

        } else {
          alert("Server error! Try again later.");
        }
      })
      .catch(err => console.log(err));
  }, []);

  if (state.got_response) {
    if (state.user_found) {
      return (
        <div className="centered">
          <a href='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>
            <img src='./debuggingtime.png' style={{ height: '300px', margin: '40px' }} />
          </a>
          <Typography variant="h6">Logged in successfully!</Typography>
          <Redirect to='/' />
        </div>

      );
    } else {
      alert("This app is only acessible to mambers of IMG.");
      return (
        <div className="centered">
          <Link to='/signin'>
            <Button>Go to Sign-in Page</Button>
          </Link>
        </div>
      );
    }
  } else {
    return (
      <div className="centered">
        <a href='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>
          <img src='./debuggingtime.png' style={{ height: '300px', margin: '40px' }} />
        </a>
        <CircularProgress color="secondary" size={50} style={{ marginBottom: "40px" }} />
        <Typography variant="h6" >If you’re waiting for the waiter at a restaurant, aren’t you the waiter? 🤔</Typography>
      </div>
    );
  }

}


const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (username, password) => dispatch(actions.authLogin(username, password))
  }
}

export default connect(null, mapDispatchToProps)(Onlogin);