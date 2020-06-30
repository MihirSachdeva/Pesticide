import React from 'react';
import Card from '@material-ui/core/Card';
import ProjectInfo from '../components/ProjectInfo';
import axios from 'axios';
import { connect } from 'react-redux';
import * as api_links from '../APILinks';
import { Typography } from '@material-ui/core';

const Projects = (props) => {
  const [projects, setProjects] = React.useState([]);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    axios.defaults.headers = {
      'Content-Type': 'application/json',
      Authorization: 'Token ' + token
    }
    token && axios.get(api_links.API_ROOT + 'projectnameslug/')
      .then(res => {
        setProjects(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <>
      <Card className="list-title-card" variant="outlined">
        <Typography className="list-title">
          Projects
        </Typography>
        <hr className="divider" />
      </Card>
      {
        projects.map(project => (
          <>
            <ProjectInfo
              projectID={project.id}
              projectslug={project.projectslug}
            />
          </>
        ))
      }
    </>
  );
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.token !== null,
  }
}

export default connect(mapStateToProps, null)(Projects);
