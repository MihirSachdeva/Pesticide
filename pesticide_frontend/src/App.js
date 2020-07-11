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
    secondary: { main: "#eee8d5", contrastText: '#ffffff' },
    background: { default: "#09232c", paper: "#002b36a0" },
  },
  solarizedLight: {
    type: "light",
    primary: { main: "#eee8d5", contrastText: '#002b36' },
    secondary: { main: "#002b36", contrastText: '#eee8d5' },
    background: { default: "#eee8d5", paper: "#eee8d5a0" },
  },
  palpatine: {
    type: "dark",
    primary: { main: "#1a1a1a", contrastText: "#ffffff" },
    secondary: { main: "#cb218e", contrastText: "#ffffff" },
    background: { default: "#101010", paper: "#1b1b1ba0" },
  },
  default: {
    type: "light",
    primary: { main: "#1a1a1a", contrastText: "#ffffff" },
    secondary: { main: "#cb218e", contrastText: "#ffffff" },
    background: { default: "#f5f5f5", paper: "#f9f9f9a0" },
  },
  dark: {
    type: "dark",
    primary: { main: "#1a1a1a", contrastText: "#ffffff" },
    secondary: { main: "#cb218e", contrastText: "#ffffff" },
    background: { default: "#303030", paper: "#424242a0" },
  }
}

const Theme = localStorage.getItem('theme') || "default";

// const scrollBarStyles = () => ({
//   '@global': {
//     '*::-webkit-scrollbar': {
//       width: '0.4em'
//     },
//     '*::-webkit-scrollbar-track': {
//       '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
//     },
//     '*::-webkit-scrollbar-thumb': {
//       backgroundColor: 'rgba(0,0,0,.1)',
//       outline: '1px solid slategrey'
//     }
//   }
// });

const theme = createMuiTheme({
  palette: {
    ...themes[Theme],
  },
  // props: {
  //   MuiButtonBase: {
  //     disableRipple: true
  //   }
  // }
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
