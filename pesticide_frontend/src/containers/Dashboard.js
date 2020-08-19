import React from "react";
import { PieChart, BarChart } from "react-chartkick";
import "chart.js";
import { Card, Typography, Button, useMediaQuery } from "@material-ui/core";
import axios from "axios";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import * as api_links from "../APILinks";
import AuthChecker from "../components/AuthChecker";

const Dashboard = (props) => {
  const isMobile = useMediaQuery("(max-width: 500px)");
  const userId = localStorage.getItem("id");
  const [name, setName] = React.useState("");
  const [enrNo, setEnrNo] = React.useState("");
  const [projectsStatusData, setProjectsStatusData] = React.useState([]);
  const [topReporters, setTopReporters] = React.useState([]);

  React.useEffect(() => {
    axios
      .get(api_links.API_ROOT + `users/${userId}/`)
      .then((res) => {
        setName(res.data.name.split(" ")[0]);
        setEnrNo(res.data.enrollment_number);
      })
      .catch((err) => console.log(err));

    axios
      .get(api_links.API_ROOT + "issuestatustally/")
      .then((res) => {
        let issuesData = [];
        let resolved = 0,
          pending = 0,
          closed = 0;
        res.data.forEach((status) => {
          switch (status.type) {
            case "Pending":
              pending += status.number_of_issues;
              break;
            case "Resolved":
              resolved += status.number_of_issues;
              break;
            case "Closed":
              closed += status.number_of_issues;
              break;
          }
          issuesData = [
            ["Pending", pending],
            ["Resolved", resolved],
            ["Closed", closed],
          ];
        });
        setProjectsStatusData(issuesData);
      })
      .catch((err) => console.log(err));

    axios
      .get(api_links.API_ROOT + "topdebuggers/")
      .then((res) => {
        let topDebuggers = [];
        topDebuggers = res.data.map((user) => [
          user.user_name,
          user.num_issues,
        ]);
        setTopReporters(topDebuggers);
      })
      .catch((err) => console.log(err));
  }, [props.isAuthenticated]);

  const bugQuoteList = [
    "Never allow the same bug to bite you twice.",
    "'It's not a bug - it's an undocumented feature.'",
    "Let he who has a bug free software cast the first stone.",
    "Debugging : Removing Bugs :: Programming : Adding Bugs",
    "Testing can be used to show the presence of bugs, but never to show their absence!",
  ];

  return (
    <div className="dashboard-cards">
      <AuthChecker message="dashboard"/>
      <Card variant="outlined" className="dashboard-hero-welcome-card">
        <div
          className="dashboard-hero-image image-shadow"
          style={{
            backgroundImage: "url(./fix.svg)",
          }}
        ></div>
        <div className="dashboard-hero-text">
          <div>
            <Typography className="dashboard-hero-welcome">
              {"Pesticide"}
            </Typography>
            <hr className="divider" />
            <Typography className="dashboard-hero-quote">
              {bugQuoteList[Math.floor(Math.random() * 5)]}
            </Typography>
            <div className="dashboard-hero-buttons">
              <Link to="/issues">
                <Button
                  className="btn-filled-small"
                  style={{ whiteSpace: "nowrap" }}
                >
                  {!isMobile && "View "}
                  {"Issues"}
                </Button>
              </Link>
              <Link to="/projects">
                <Button
                  className="btn-filled-small"
                  style={{ whiteSpace: "nowrap" }}
                >
                  {!isMobile && "Browse "}
                  {"Projects"}
                </Button>
              </Link>
              <Link to={`/users/${enrNo}`}>
                <Button
                  className="btn-filled-small"
                  style={{ whiteSpace: "nowrap" }}
                >
                  My Page
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
      <div className="data-charts-top-container">
        <Card variant="outlined" className="donut-chart-card">
          <center>
            <Typography style={{ fontSize: "20px" }}>
              <strong>
                Issues at a Glance
                <hr className="divider" />
              </strong>
            </Typography>
            <p style={{ fontWeight: "300" }}>Status tally of all issues.</p>
          </center>
          <PieChart
            donut={true}
            colors={["#3b7fff", "#00ea3f", "#ff0021"]}
            data={projectsStatusData}
            style={{
              margin: "10px",
            }}
          />
        </Card>

        <Card variant="outlined" className="donut-chart-card">
          <center>
            <Typography style={{ fontSize: "20px" }}>
              <strong>
                Top Debuggers
                <hr className="divider" />
              </strong>
            </Typography>
            <p style={{ fontWeight: "300" }}>
              Users who have reported highest number of issues.
            </p>
          </center>
          <BarChart colors={["3b7fff"]} data={topReporters} />
        </Card>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.token !== null,
  };
};

export default withRouter(connect(mapStateToProps, null)(Dashboard));
