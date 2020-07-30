import React from 'react';
import { Card, Typography } from '@material-ui/core';

import UserCard from '../components/UserCard';
import * as api_links from '../APILinks';

import axios from 'axios';

const UsersPage = (props) => {
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    axios.get(api_links.API_ROOT + 'users/')
      .then(res => {
        setUsers(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <>
      <Card className="list-title-card" variant="outlined">
        <Typography className="list-title">
          Users
        </Typography>
        {/* <hr className="divider" /> */}
      </Card>
      <div className="user-card-container">
        <div className="user-card-grid">
          {
            users.map(user => (
              <UserCard
                id={user.id}
                name={user.name}
                is_admin={user.is_admin}
                enrollment_number={user.enrollment_number}
                degree={user.degree}
                branch={user.branch}
                current_year={user.current_year}
                is_active={user.is_active}
                user={user.user}
                display_photo={user.display_picture}
              />
            ))
          }
        </div>
      </div>
    </>
  );
}

export default UsersPage;