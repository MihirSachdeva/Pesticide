import React from 'react';
import { PieChart, BarChart } from 'react-chartkick';
import 'chart.js';
import { Card, Typography, Button } from '@material-ui/core';
import { Link } from "react-router-dom";
import axios from 'axios';
import * as api_links from '../APILinks';

export default function Dashboard(props) {

  const [issues, setIssues] = React.useState([]);
  const [users, setUsers] = React.useState([{
    name: 'Bounty Hunter'
  }]);
  const [projectsStatusData, setProjectsStatusData] = React.useState([
    ['Open', 1],
    ['Closed', 1],
    ['Unclear', 1],
    ['Fixed', 1],
    ['Not_a_bug', 1],
    ['Needs_more_information', 1],
  ]);
  const [topReporters, setTopReporters] = React.useState([
    ['First', 19],
    ['Second', 13],
    ['Third', 7],
    ['Fourth', 3]
  ]);

  React.useEffect(() => {
    axios.get(api_links.API_ROOT + 'issues/')
      .then(res => {
        setIssues(res.data);
        const Open = res.data.filter(issue => issue.status == "Open").length;
        const Closed = res.data.filter(issue => issue.status == "Closed").length;
        const Unclear = res.data.filter(issue => issue.status == "Unclear").length;
        const Fixed = res.data.filter(issue => issue.status == "Fixed").length;
        const Not_a_bug = res.data.filter(issue => issue.status == "Not_a_bug").length;
        const Needs_more_information = res.data.filter(issue => issue.status == "Needs_more_information").length;

        setProjectsStatusData([
          ['Open', Open],
          ['Closed', Closed],
          ['Unclear', Unclear],
          ['Fixed', Fixed],
          ['Not_a_bug', Not_a_bug],
          ['Needs_more_information', Needs_more_information],
        ]);
      })
      .catch(err => console.log(err));

    axios.get(api_links.API_ROOT + 'userissues/')
      .then(res => {
        const sortedUsers = res.data.sort((a, b) => b.issues.length - a.issues.length);
        setUsers(sortedUsers);
        setTopReporters([
          [sortedUsers[0].name, sortedUsers[0].issues.length],
          [sortedUsers[1].name, sortedUsers[1].issues.length],
          [sortedUsers[2].name, sortedUsers[2].issues.length],
          [sortedUsers[3].name, sortedUsers[3].issues.length],
        ])
      })
      .catch(err => console.log(err));
  }, []);

  const bugQuoteList = [
    "Never allow the same bug to bite you twice.",
    "'It's not a bug - it's an undocumented feature.'",
    "Let he who has a bug free software cast the first stone.",
    "If debugging is the process of removing bugs, then programming must be the process of putting them in.",
    "Program testing can be used to show the presence of bugs, but never to show their absence!"
  ];

  return (
    <div className="dashboard-cards">
      <Card
        variant="outlined"
        className="dashboard-hero-welcome-card"
      >
        <div
          className="dashboard-hero-image image-shadow"
          style={{
            backgroundImage: "url(./fix.svg)",
          }}
        >
        </div>
        <div className="dashboard-hero-text">
          <div>
            <Typography className="dashboard-hero-welcome">
              Hi, Mihir!
          </Typography>
            <hr className="divider" />
            <Typography
              className="dashboard-hero-quote"
            >
              {bugQuoteList[Math.floor(Math.random() * 5)]}
            </Typography>
            <div className="dashboard-hero-buttons">
              <Link to="/issues">
                <Button className="btn-filled-small">
                  Browse Issues
              </Button>
              </Link>
              <Button className="btn-filled-small">
                My Page
              </Button>
            </div>
          </div>
        </div>
      </Card>
      <div className="data-charts-top-container">
        <Card
          variant="outlined"
          className="donut-chart-card"
        >
          <center>
            <Typography style={{ fontSize: '20px' }}>
              <strong>
                Issues at a Glance
              <hr className="divider" />
              </strong>
            </Typography>
            <p style={{ fontWeight: '300' }}>
              Status tally of all issues.
          </p>
          </center>
          <PieChart
            donut={true}
            colors={[
              '#00caf5',
              '#ff0021',
              '#ffd742',
              '#00ea3f',
              '#ff02bb',
              '#bc64ff',
            ]}
            data={projectsStatusData}
            style={{
              margin: '10px'
            }}
          />
        </Card>

        <Card
          variant="outlined"
          className="donut-chart-card"
        >
          <center>
            <Typography style={{ fontSize: '20px' }}>
              <strong>
                Top Debuggers
              <hr className="divider" />
              </strong>
            </Typography>
            <p style={{ fontWeight: '300' }}>
              Users who have reported highest number of issues.
          </p>

            {/* <p>
              All hail
              <Link to={`/users/${users[0].enrollment_number}`}>
                <strong>
                  {" " + users[0].name + " 👑"}
                </strong>
              </Link>
              , the greatest bounty hunter of 'em all!
            </p> */}
          </center>
          <BarChart
            colors={[['00caf5', 'ff02bb', 'bc64ff'][Math.floor(Math.random() * 3)]]}
            data={topReporters}
          />
        </Card>
      </div>
    </div>
  )
}