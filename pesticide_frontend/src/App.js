import React from "react";
import "./App.css";
import { connect } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import BaseRouter from "./routes";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import * as actions from "./store/actions/auth";
import axios from "axios";
import Layout from "./containers/Layout";

const themes = {
  solarizedDark: {
    type: "dark",
    primary: { main: "#002b36", contrastText: "#eee8d5" },
    secondary: { main: "#eee8d5", contrastText: "#ffffff" },
    background: { default: "#09232c", paper: "#002b36a0" },
  },
  solarizedLight: {
    type: "light",
    primary: { main: "#fff7dd", contrastText: "#002b36" },
    secondary: { main: "#002b36", contrastText: "#eee8d5" },
    background: { default: "#eee8d5", paper: "#fff7ddb3" },
  },
  palpatine: {
    type: "dark",
    primary: { main: "#1a1a1a", contrastText: "#ffffff" },
    secondary: { main: "#cb218e", contrastText: "#ffffff" },
    background: { default: "#101010", paper: "#1b1b1ba0" },
  },
  default: {
    type: "light",
    primary: { main: "#ffffff", contrastText: "#000000" },
    secondary: { main: "#356fff", contrastText: "#ffffff" },
    background: { default: "#f0f2f5", paper: "#ffffffb3" },
  },
  dark: {
    type: "dark",
    primary: { main: "#282828", contrastText: "#ffffff" },
    secondary: { main: "#356fff", contrastText: "#ffffff" },
    background: { default: "#18191a", paper: "#242526a0" },
  },
};

const App = (props) => {
  const theme = (theme) =>
    createMuiTheme({
      palette: themes[theme],
      props: {
        MuiButtonBase: {
          disableRipple: true,
        },
      },
    });

  React.useEffect(() => {
    props.onTryAutoSignup();
  }, []);

  return (
    <Router>
      <ThemeProvider theme={theme(props.currentTheme)}>
        <Layout>
          <BaseRouter />
        </Layout>
      </ThemeProvider>
    </Router>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    currentTheme: state.theme.theme || "default",
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
