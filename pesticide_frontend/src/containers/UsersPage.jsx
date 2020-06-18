import React from 'react';
import UserCard from '../components/UserCard';
import axios from 'axios';

const UsersPage = (props) => {
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/users/')
      .then(res => {
        setUsers(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <>
      {

        users.map(user => (
          <div className="user-card-container">
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
          </div>
        ))

      }
    </>
  );
}

export default UsersPage;