import React, { useState } from "react";
import clsx from "clsx";
import { fade, makeStyles, withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import BugReportRoundedIcon from "@material-ui/icons/BugReportRounded";
import SettingsIcon from "@material-ui/icons/Settings";
import WidgetsRoundedIcon from "@material-ui/icons/WidgetsRounded";
import SecurityRoundedIcon from "@material-ui/icons/SecurityRounded";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import PeopleIcon from "@material-ui/icons/People";
import DefaultTooltip from "@material-ui/core/Tooltip";
import ListSubheader from "@material-ui/core/ListSubheader";
import Brightness4RoundedIcon from "@material-ui/icons/Brightness4Rounded";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";

import * as actions from "../store/actions/auth";
import * as themeActions from "../store/actions/theme";
import * as api_links from "../APILinks";

import axios from "axios";

const drawerWidth = 270;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
  expand: {
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: 0,
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

const HeaderSidePanel = (props) => {
  const Tooltip = withStyles({
    tooltip: {
      backgroundColor: props.darkTheme ? "#353535" : "#ffffff",
      color: props.darkTheme ? "#ffffff" : "#353535",
      backgroundFilter: "blur(20px)",
      fontSize: "17px",
      fontWeight: "900",
      padding: "5px",
      border: "1px solid #808080b3",
      borderRadius: "10px",
    },
  })(DefaultTooltip);
  const search = {
    position: "relative",
    borderRadius: "10px",
    backgroundColor: props.darkTheme ? "rgba(0,0,0,0.20)" : "rgba(0,0,0,0.10)",
    width: "100%",
    display: "flex",
    alignItems: "center",
    padding: "10px 5px",
    height: "50px",
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles();
  // const [open, setOpen] = useState(window.innerWidth > 850);
  const [open, setOpen] = useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const magic = {
    color: props.currentTheme == "palpatine" && "red",
  };

  const [projects, setProjects] = React.useState([]);
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: "Token " + token,
    };
    token &&
      axios
        .get(api_links.API_ROOT + "projects/")
        .then((res) => {
          setProjects(res.data);
        })
        .catch((err) => console.log(err));
    token &&
      axios
        .get(api_links.API_ROOT + "current_user/")
        .then((res) => {
          setIsAdmin(res.data[0].is_master);
        })
        .catch((err) => console.log(err));
  }, [props.isAuthenticated, props.currentTheme]);

  const [anchorThemeEl, setAnchorThemeEl] = useState(null);

  const handleThemeBtnClick = (event) => {
    setAnchorThemeEl(event.currentTarget);
  };

  const handleThemeBtnClose = () => {
    setAnchorThemeEl(null);
  };

  return (
    <>
      {props.isAuthenticated && !isMobile && (
        <Drawer
          variant={"permanent"}
          classes={{
            paper: clsx(classes.drawerPaper),
          }}
        >
          <div className={classes.toolbarIcon}>
            <Typography
              style={{
                margin: "15px",
                marginRight: "auto",
                fontSize: "25px",
                fontWeight: "600",
              }}
            ></Typography>
          </div>

          <List>
            <ListItem
              style={{ padding: "4px 10px", margin: "7px", width: "auto" }}
            >
              <div style={search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder="Search"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  inputProps={{ "aria-label": "search" }}
                />
              </div>
            </ListItem>

            <Link to="/">
              <ListItem
                button
                onClick={() => {
                  isMobile && handleDrawerClose();
                }}
                className="drawer-btn-filled"
              >
                <ListItemIcon style={magic}>
                  <div className="drawer-project-icon-container">
                    <HomeRoundedIcon />
                  </div>
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>
            </Link>

            <Link to="/users">
              <ListItem
                button
                onClick={() => {
                  isMobile && handleDrawerClose();
                }}
                className="drawer-btn-filled"
              >
                <ListItemIcon style={magic}>
                  <div className="drawer-project-icon-container">
                    <PeopleIcon />
                  </div>
                </ListItemIcon>
                <ListItemText primary="Users" />
              </ListItem>
            </Link>

            <Link to="/projects">
              <ListItem
                button
                onClick={() => {
                  isMobile && handleDrawerClose();
                }}
                className="drawer-btn-filled"
              >
                <ListItemIcon style={magic}>
                  <div className="drawer-project-icon-container">
                    <WidgetsRoundedIcon />
                  </div>
                </ListItemIcon>
                <ListItemText primary="Projects" />
              </ListItem>
            </Link>

            <Link to="/issues">
              <ListItem
                button
                onClick={() => {
                  isMobile && handleDrawerClose();
                }}
                className="drawer-btn-filled"
              >
                <ListItemIcon style={magic}>
                  <div className="drawer-project-icon-container">
                    <BugReportRoundedIcon />
                  </div>
                </ListItemIcon>
                <ListItemText primary="Issues" />
              </ListItem>
            </Link>

            <Link to="/settings">
              <ListItem
                button
                onClick={() => {
                  isMobile && handleDrawerClose();
                }}
                className="drawer-btn-filled"
              >
                <ListItemIcon style={magic}>
                  <div className="drawer-project-icon-container">
                    <SettingsIcon />
                  </div>
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItem>
            </Link>

            {isAdmin && (
              <Link to="/admin">
                <ListItem
                  button
                  onClick={() => {
                    isMobile && handleDrawerClose();
                  }}
                  className="drawer-btn-filled"
                >
                  <ListItemIcon style={magic}>
                    <div className="drawer-project-icon-container">
                      <SecurityRoundedIcon />
                    </div>
                  </ListItemIcon>
                  <ListItemText primary="Admin" />
                </ListItem>
              </Link>
            )}
          </List>

          <List>
            <ListSubheader inset>Projects</ListSubheader>

            {projects.map((project) => (
              <>
                <Link to={"/projects/" + project.projectslug}>
                  <ListItem
                    button
                    onClick={() => {
                      isMobile && handleDrawerClose();
                    }}
                    className="drawer-btn-filled"
                  >
                    <ListItemIcon>
                      <div className="drawer-project-icon-container">
                        <img
                          src={
                            project.icon != undefined
                              ? api_links.ROOT + project.icon
                              : "../appicon.png"
                          }
                          style={{
                            width: "35px",
                            borderRadius: "9px",
                            padding: "2px",
                          }}
                        />
                      </div>
                    </ListItemIcon>
                    <ListItemText primary={project.name} />
                  </ListItem>
                </Link>
              </>
            ))}
          </List>
        </Drawer>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    currentTheme: state.theme.theme,
    headerTitle: state.header.title,
    darkTheme:
      state.theme.theme == "dark" ||
      state.theme.theme == "solarizedDark" ||
      state.theme.theme == "palpatine",
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(actions.logout()),
    changeTheme: (newTheme) => dispatch(themeActions.changeTheme(newTheme)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HeaderSidePanel)
);
