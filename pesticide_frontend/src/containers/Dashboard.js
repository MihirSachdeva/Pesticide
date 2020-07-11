import React from 'react';
import { PieChart, BarChart } from 'react-chartkick';
import 'chart.js';
import { Card, Typography, Button, useMediaQuery } from '@material-ui/core';
import { Link } from "react-router-dom";
import axios from 'axios';
import * as api_links from '../APILinks';

export default function Dashboard() {
  const isMobile = useMediaQuery('(max-width: 500px)');
  const userId = localStorage.getItem('id');
  const [name, setName] = React.useState('');
  const [enrNo, setEnrNo] = React.useState('');
  const [projectsStatusData, setProjectsStatusData] = React.useState([]);
  const [topReporters, setTopReporters] = React.useState([]);

  React.useEffect(() => {
    axios.get(api_links.API_ROOT + `users/${userId}/`)
      .then(res => {
        setName(res.data.name.split(" ")[0]);
        setEnrNo(res.data.enrollment_number);
      })
      .catch(err => console.log(err));

    axios.get(api_links.API_ROOT + 'issuestatustally/')
      .then(res => {
        let issuesData = [];
        issuesData = res.data.map(status => [status.status_text, status.number_of_issues]);
        setProjectsStatusData(issuesData);
      })
      .catch(err => console.log(err));

    axios.get(api_links.API_ROOT + 'topdebuggers/')
      .then(res => {
        let topDebuggers = [];
        topDebuggers = res.data.map(user => [user.user_name, user.num_issues]);
        setTopReporters(topDebuggers)
      })
      .catch(err => console.log(err));
  }, []);

  const bugQuoteList = [
    "Never allow the same bug to bite you twice.",
    "'It's not a bug - it's an undocumented feature.'",
    "Let he who has a bug free software cast the first stone.",
    "Debugging : Removing Bugs :: Programming : Adding Bugs",
    "Testing can be used to show the presence of bugs, but never to show their absence!"
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
              {name != '' && `Hi, ${name}!`}
            </Typography>
            <hr className="divider" />
            <Typography
              className="dashboard-hero-quote"
            >
              {bugQuoteList[Math.floor(Math.random() * 5)]}
            </Typography>
            <div className="dashboard-hero-buttons">
              <Link to="/issues">
                <Button className="btn-filled-small" style={{ whiteSpace: 'nowrap' }}>
                  {!isMobile && 'View '}
                  {'Issues'}
                </Button>
              </Link>
              <Link to="/projects">
                <Button className="btn-filled-small" style={{ whiteSpace: 'nowrap' }}>
                  {!isMobile && 'Browse '}
                  {'Projects'}
                </Button>
              </Link>
              <Link to={`/users/${enrNo}`}>
                <Button className="btn-filled-small" style={{ whiteSpace: 'nowrap' }}>
                  My Page
              </Button>
              </Link>
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
            // colors={[
            //   '#00caf5',
            //   '#ff0021',
            //   '#ffd742',
            //   '#00ea3f',
            //   '#ff02bb',
            //   '#bc64ff',
            // ]}
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
            // colors={[['00caf5', 'ff02bb', 'bc64ff'][Math.floor(Math.random() * 3)]]}
            data={topReporters}
          />
        </Card>
      </div>
    </div>
  )
}