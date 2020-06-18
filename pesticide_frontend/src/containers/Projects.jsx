import React from 'react';
import Divider from '@material-ui/core/Divider';
import ProjectInfo from '../components/ProjectInfo';
import axios from 'axios';
import { connect } from 'react-redux';

const  Projects = (props) => {
  const [projects, setProjects] = React.useState([]);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    axios.defaults.headers = {
      'Content-Type': 'application/json',
      Authorization: 'Token ' + token
  }
    token && axios.get('http://127.0.0.1:8000/api/projectnameslug/')
      .then(res => {
        setProjects(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <> 
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
