import React from 'react';
import './App.css';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import BaseRouter from './routes';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import * as actions from './store/actions/auth';
import axios from 'axios';
import Layout from './containers/Layout';

const themes = {
  solarizedDark: {
    type: "dark",
    primary: { main: "#002b36", contrastText: '#eee8d5' },
    secondary: { main: "#eee8d5", contrastText: '#002b36' },
    background: { default: "#09232c", paper: "#002b36" },
  },
  solarizedLight: {
    type: "light",
    primary: { main: "#eee8d5", contrastText: '#002b36' },
    secondary: { main: "#002b36", contrastText: '#eee8d5' },
    background: { default: "#eee8d5", paper: "#e8e1cb" },
  },
  mint: {
    type: "light",
    primary: { main: "#02ac9c", contrastText: "#ffffff" },
    secondary: { main: "#427ae9", contrastText: "#ffffff" },
    background: { default: "#eff6f5", paper: "#e6f3f1" },

  },
  palpatine: {
    type: "dark",
    primary: { main: "#1a1a1a", contrastText: "#ffffff" },
    secondary: { main: "#851a1a", contrastText: "#ffffff" },
    background: { default: "#101010", paper: "#181818" },
  },
  kawaii: {
    type: "light",
    primary: { main: "#f28286", contrastText: "#ffffff" },
    secondary: { main: "#7dc8b7", contrastText: "#ffffff" },
    background: { default: "#fae3d9", paper: "#f9dcd3" },
  },
  default: {
    type: "light",
  },
  dark: {
    type: "dark"
  }
}

const Theme = localStorage.getItem('theme') || "default";

const theme = createMuiTheme({
  palette: {
    ...themes[Theme],
    // type: "dark",
    // primary: { main: "#002b36", contrastText: '#eee8d5' },
    // secondary: { main: "#eee8d5", contrastText: '#002b36' },
    // background: { default: "#0f2328", paper: "#283e43" },

    // secondary: {main: "#6435c9", contrastText: '#ffffff'},
    // secondary: {main: "#e8dbe4"},
    // contrastText: '#eee8d5',
    // default: {main: '#eee8d5'},

    // // primary: {
    // //   light: '#757ce8',
    // //   main: '#3f50b5',
    // //   dark: '#002884',
    // //   contrastText: '#fff',
    // // },
    // secondary: {
    //   light: '#ff7961',
    //   main: '#f44336',
    //   dark: '#ba000d',
    //   contrastText: '#fff',
    // },


    // type: "light",
    // primary: {main: "#eee8d5", contrastText: '#002b36'},
    // secondary: {main: "#002b36", contrastText: '#eee8d5'},
    // background: {default: "#d6d2c6", paper: "#cdc7b5"},


    // background: {default: "#073642", paper: "#073642", contrastText: '#eee8d5'}
  }
});

const App = (props) => {

  React.useEffect(() => {
    props.onTryAutoSignup();
  }, []);

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Layout>
          <BaseRouter />
        </Layout>
      </ThemeProvider>
    </Router>
  );
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.token !== null,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
