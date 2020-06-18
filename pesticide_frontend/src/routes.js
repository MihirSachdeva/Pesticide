import React from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from "react-redux";

import Signin from './containers/Signin';
import Onlogin from './containers/Onlogin';

import Layout from './containers/Layout';
import Settings from './containers/Settings';
import Projects from './containers/Projects';
import ProjectPage from './containers/ProjectPage';
import axios from 'axios';
import UsersPage from './containers/UsersPage';
import UserPage from './containers/UserPage';

const BaseRouter = (props) => {

  return (
    <Switch>
      <Route exact path="/" component={Projects} />
      <Route exact path="/signin" component={Signin} />
      <Route exact path="/onlogin" component={Onlogin} />
      <Route exact path="/settings" component={Settings} />
      <Route exact path="/projects" component={Projects} />
      <Route exact path="/users" component={UsersPage} />
      <Route exact path="/users/:enrollmentNumber" component={UserPage} />
      <Route exact path="/projects/:projectslug" component={ProjectPage} />
    </Switch>
  );
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.token !== null,
  }
}

export default connect(mapStateToProps, null)(BaseRouter);
