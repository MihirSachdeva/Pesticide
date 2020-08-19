import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { API_ROOT } from "../APILinks";

const AuthChecker = (props) => {
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
  return (
    <div style={{ display: "none" }}>
      {props.not && user.status === "LOGGED_IN" && <Redirect to="/" />}
      {props.onlyAdmins &&
        user.status === "LOGGED_IN" &&
        user.is_master === false && <Redirect to="/" />}
      {!props.onLogin && user.status === "NOT_LOGGED_IN" && <Redirect to="/signin" />}
      {/* can also check where user is coming from, and then redirect to that page after signing in */}
    </div>
  );
};

export default AuthChecker;
