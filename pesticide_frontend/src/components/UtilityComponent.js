import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import { withRouter, Redirect } from "react-router-dom";
import { API_ROOT } from "../APILinks";
import * as headerActions from "../store/actions/header";

const UtilityComponent = (props) => {
  const [user, setUser] = React.useState({
    status: "",
  });
  React.useEffect(() => {
    let token = localStorage.getItem("token") || "";
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: "Token " + token,
    };
    axios
      .get(API_ROOT + "user_logged_in/")
      .then((res) => {
        setUser({
          status: "LOGGED_IN",
          is_master: res.data[0].is_master,
        });
      })
      .catch((err) => {
        console.log(err);
        setUser({ status: "NOT_LOGGED_IN" });
      });
  }, [props]);
  React.useEffect(() => {
    props.changeHeaderTitle(props.title);
  }, [props.title]);
  return (
    <div style={{ display: "none" }}>
      {props.not && user.status === "LOGGED_IN" && <Redirect to="/" />}
      {props.onlyAdmins &&
        user.status === "LOGGED_IN" &&
        user.is_master === false && <Redirect to="/" />}
      {!props.onLogin && user.status === "NOT_LOGGED_IN" && (
        <Redirect to="/signin" />
      )}
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeHeaderTitle: (title) => dispatch(headerActions.changeTitle(title)),
  };
};

export default withRouter(connect(null, mapDispatchToProps)(UtilityComponent));
