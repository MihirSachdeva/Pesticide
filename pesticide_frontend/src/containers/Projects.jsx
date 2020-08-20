import React from "react";
import Card from "@material-ui/core/Card";
import { Typography } from "@material-ui/core";

import axios from "axios";

import { connect } from "react-redux";

import * as api_links from "../APILinks";
import ProjectInfo from "../components/ProjectInfo";
import AlertDialog from "../components/AlertDialog";
import UtilityComponent from "../components/UtilityComponent";
import header_nav_titles from "../header_nav_titles";
import HEADER_NAV_TITLES from "../header_nav_titles";

const Projects = (props) => {
  const [projects, setProjects] = React.useState([]);
  const [alert, setAlert] = React.useState({
    open: false,
  });
  const openAlert = (action, title, description, cancel, confirm, data) => {
    setAlert({
      open: true,
      title,
      description,
      cancel,
      confirm,
      action,
      data,
    });
  };

  const closeAlert = () => {
    setAlert((prevAlertState) => ({
      open: false,
    }));
  };

  const confirmAlert = (event, choice, id) => {
    switch (event) {
      case "delete_project":
        choice && handleProjectDelete(id);
        break;
    }
  };

  const handleProjectDelete = (projectID) => {
    axios
      .delete(api_links.API_ROOT + `projects/${projectID}/`)
      .then((res) => {
        let audio = new Audio(
          "../sounds/navigation_selection-complete-celebration.wav"
        );
        audio.play();
        setTimeout(() => {
          window.location.href = "/projects";
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        let audio = new Audio("../sounds/alert_error-03.wav");
        audio.play();
      });
  };

  React.useEffect(() => {
    setAlert({
      open: false,
    });
    const token = localStorage.getItem("token");
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: "Token " + token,
    };
    token &&
      axios
        .get(api_links.API_ROOT + "projectnameslug/")
        .then((res) => {
          setProjects(res.data);
        })
        .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <UtilityComponent title={HEADER_NAV_TITLES.PROJECTS} />

      <Card className="list-title-card" variant="outlined">
        <Typography className="list-title">Projects</Typography>
      </Card>
      {projects.map((project) => (
        <>
          <ProjectInfo
            projectID={project.id}
            projectslug={project.projectslug}
            openAlert={openAlert}
          />
        </>
      ))}
      <AlertDialog
        open={alert.open}
        action={alert.action}
        title={alert.title || ""}
        description={alert.description || ""}
        cancel={alert.cancel || ""}
        confirm={alert.confirm || ""}
        confirmAlert={confirmAlert}
        data={alert.data || ""}
        closeAlert={closeAlert}
      />
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

export default connect(mapStateToProps, null)(Projects);
