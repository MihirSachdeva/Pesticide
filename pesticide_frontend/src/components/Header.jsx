import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import BugReportRoundedIcon from '@material-ui/icons/BugReportRounded';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CodeIcon from '@material-ui/icons/Code';
import SecurityRoundedIcon from '@material-ui/icons/SecurityRounded';
import { connect } from "react-redux";
import { Link, withRouter, Redirect } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import Tooltip from '@material-ui/core/Tooltip';
import ListSubheader from '@material-ui/core/ListSubheader';
import Brightness4RoundedIcon from '@material-ui/icons/Brightness4Rounded';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import NewProjectWithModal from '../components/NewProjectWithModal';

import * as actions from '../store/actions/auth';
import Axios from 'axios';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}));


const Header = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const classes = useStyles();
  const [open, setOpen] = useState(window.innerWidth > 850);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const [anchorEl, setAnchorEl] = useState(null);

  const handleNavMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNavMenuClose = () => {
    setAnchorEl(null);
  };

  const [projects, setProjects] = React.useState([]);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    Axios.defaults.headers = {
      'Content-Type': 'application/json',
      Authorization: 'Token ' + token
    }
    token && Axios.get('http://127.0.0.1:8000/api/projects/')
      .then(res => {
        setProjects(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  const [anchorThemeEl, setAnchorThemeEl] = useState(null);

  const handleThemeBtnClick = (event) => {
    setAnchorThemeEl(event.currentTarget);
  };

  const handleThemeBtnClose = () => {
    setAnchorThemeEl(null);
  };

  return (
    <>
      <AppBar position="absolute" className={clsx(classes.appBar)}>
        <Toolbar>
          {
            props.isAuthenticated &&
            <Button
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={open ? handleDrawerClose : handleDrawerOpen}
              className={isMobile && clsx(classes.menuButton)}
              className="header-title-button"
            >
              {isMobile ? <MenuIcon /> : <ChevronRightIcon className={clsx(classes.expand, { [classes.expandOpen]: open })} />}
            </Button>
          }

          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title} style={{ textAlign: "center" }}>
            <Button
              className="header-title-button"
            >
              <Link to="/" className={classes.title}>
                Pesticide
            </Link>
            </Button>

          </Typography>

          <Button
            aria-controls="simple-theme-menu"
            aria-haspopup="true"
            color="inherit"
            className="header-title-button"
          >
            <Brightness4RoundedIcon onClick={handleThemeBtnClick} />
            <Menu
              id="simple-theme-menu"
              anchorEl={anchorThemeEl}
              keepMounted
              open={Boolean(anchorThemeEl)}
              onClose={handleThemeBtnClose}
              style={{ marginTop: '30px' }}
            >
              <MenuItem onClick={() => {
                handleThemeBtnClose();
                localStorage.setItem('theme', 'default');
                window.location.reload();
              }}>
                Light
              </MenuItem>
              <MenuItem onClick={() => {
                handleThemeBtnClose();
                localStorage.setItem('theme', 'dark');
                window.location.reload();
              }}>
                Dark
              </MenuItem>
              <MenuItem onClick={() => {
                handleThemeBtnClose();
                localStorage.setItem('theme', 'solarizedLight');
                window.location.reload();
              }}>
                Solarized Light
              </MenuItem>
              <MenuItem onClick={() => {
                handleThemeBtnClose();
                localStorage.setItem('theme', 'solarizedDark');
                window.location.reload();
              }}>
                Solarized Dark
              </MenuItem>
            </Menu>
          </Button>

          {
            props.isAuthenticated &&
            <Button
              color="inherit"
              className="header-title-button"
            >
              <MoreVertIcon onClick={handleNavMenuOpen} />
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleNavMenuClose}
                style={{ marginTop: '30px' }}
              >

                <Link to="/settings"><MenuItem onClick={handleNavMenuClose}><SettingsIcon />&nbsp;Settings</MenuItem></Link>
                <Link to="/projects"><MenuItem onClick={handleNavMenuClose}><CodeIcon />&nbsp;Projects</MenuItem></Link>
                <Link to="/admin"><MenuItem onClick={handleNavMenuClose}><SecurityRoundedIcon />&nbsp;Admin</MenuItem></Link>
                <MenuItem
                  onClick={() => {
                    props.logout();
                    window.location.href = '/signin';
                  }}
                >
                  <ExitToAppIcon />&nbsp;Logout</MenuItem>
              </Menu>
            </Button>
          }

        </Toolbar>
      </AppBar>

      {
        props.isAuthenticated &&
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          open={open}
          ModalProps={{ onBackdropClick: handleDrawerClose }}
        >
          <div className={classes.toolbarIcon}>
            <Button
              onClick={handleDrawerClose}
              style={{ padding: '12px', margin: '2px', borderRadius: '10px' }}
            >
              <ChevronLeftIcon />
            </Button>
          </div>


          <List>

            <Link to="/">
              <Tooltip title={!open ? "Dashboard" : ""} placement="right" interactive className="drawer-btn-filled">
                <ListItem button onClick={() => { isMobile && handleDrawerClose() }}>
                  <ListItemIcon>
                    <div className="drawer-project-icon-container">
                      <DashboardIcon />
                    </div>
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItem>
              </Tooltip>
            </Link>

            <Link to="/users">
              <Tooltip title={!open ? "Users" : ""} placement="right" interactive className="drawer-btn-filled">
                <ListItem button onClick={() => { isMobile && handleDrawerClose() }}>
                  <ListItemIcon>
                    <div className="drawer-project-icon-container">
                      <PeopleIcon />
                    </div>
                  </ListItemIcon>
                  <ListItemText primary="Users" />
                </ListItem>
              </Tooltip>
            </Link>

            <Link to="/projects">
              <Tooltip title={!open ? "Projects" : ""} placement="right" interactive className="drawer-btn-filled">
                <ListItem button onClick={() => { isMobile && handleDrawerClose() }}>
                  <ListItemIcon>
                    <div className="drawer-project-icon-container">
                      <CodeIcon />
                    </div>
                  </ListItemIcon>
                  <ListItemText primary="Projects" />
                </ListItem>
              </Tooltip>
            </Link>

            <Link to="/issues">
              <Tooltip title={!open ? "Issues" : ""} placement="right" interactive className="drawer-btn-filled">
                <ListItem button onClick={() => { isMobile && handleDrawerClose() }}>
                  <ListItemIcon>
                    <div className="drawer-project-icon-container">
                      <BugReportRoundedIcon />
                    </div>
                  </ListItemIcon>
                  <ListItemText primary="Issues" />
                </ListItem>
              </Tooltip>
            </Link>

            <Link to="/settings">
              <Tooltip title={!open ? "Settings" : ""} placement="right" interactive className="drawer-btn-filled">
                <ListItem button onClick={() => { isMobile && handleDrawerClose() }}>
                  <ListItemIcon>
                    <div className="drawer-project-icon-container">
                      <SettingsIcon />
                    </div>
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </ListItem>
              </Tooltip>
            </Link>

            <Link to="/admin">
              <Tooltip title={!open ? "Admin" : ""} placement="right" interactive className="drawer-btn-filled">
                <ListItem button onClick={() => { isMobile && handleDrawerClose() }}>
                  <ListItemIcon>
                    <div className="drawer-project-icon-container">
                      <SecurityRoundedIcon />
                    </div>
                  </ListItemIcon>
                  <ListItemText primary="Admin" />
                </ListItem>
              </Tooltip>
            </Link>

            <NewProjectWithModal open={open}/>

          </List>

          <List>
            <ListSubheader inset>Projects</ListSubheader>

            {projects.map(project => (
              <>
                <a href={"/projects/" + project.projectslug}>
                  <Tooltip title={!open ? project.name : ""} placement="right" interactive className="drawer-btn-filled">
                    <ListItem button onClick={() => { isMobile && handleDrawerClose() }}>
                      <ListItemIcon>
                        <div className="drawer-project-icon-container">
                          <img
                            src={project.icon[0] != undefined ? project.icon[0].image : "../appicon.png"}
                            style={{
                              width: '35px',
                              borderRadius: '10px',
                              padding: '2px'
                            }}
                          />
                        </div>
                      </ListItemIcon>
                      <ListItemText primary={project.name} />
                    </ListItem>
                  </Tooltip>
                </a>
              </>
            ))}
          </List>
        </Drawer>
      }
    </>

  );
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.token !== null,
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(actions.logout())
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));