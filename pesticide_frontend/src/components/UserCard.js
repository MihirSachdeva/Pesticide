import React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Skeleton from '@material-ui/lab/Skeleton';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { Link, Redirect } from "react-router-dom";

export default function UserCard(props) {

  const isMobile = useMediaQuery('(max-width: 700px)');

  return (
    <Card
      // style={{
      //   borderRadius: "15px",
      //   padding: '7px 0'
      // }}
      className="user-card"
      variant="outlined"
    >
      <CardHeader
        avatar={
          <Link to={`/users/${props.enrollment_number}`}>
            <div style={{
              width: isMobile ? "100px" : "120px",
              height: isMobile ? "100px" : "120px",
              borderRadius: "70px",
              padding: "4px",
              backgroundImage: props.display_photo ? `url(${props.display_photo})` : 'url(../sunglasses.svg)',
            }}
              className='image-shadow'
            >
            </div>
          </Link>
        }

        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: isMobile ? '17px' : '20px' }}>
              {
                !props.name
                  ?
                  <Skeleton width={100} height={50} animation="wave" />
                  :
                  <Link to={"/users/" + props.enrollment_number}>{props.name}</Link>
              }
            </div>
          </div>
        }
        subheader={
          <div>
            <span>{
              props.enrollment_number ?
                props.enrollment_number
                :
                <Skeleton width={140} animation="wave" />
            }</span>
            <br />
            {
              props.current_year &&
              <>
                <span>
                  {['Webmaster',
                    'Project Associate',
                    'Project Leader',
                    'Coordinator',
                    'Boomer'][props.current_year - 1]}
                </span>
                <br />
              </>
            }
            <span>{props.current_year ?
              ["First Year", "Second Year", "Third Year", "Fourth Year", "Fifth Year", "Boomer"][props.current_year - 1]
              :
              <Skeleton width={140} animation="wave" />
            }</span>
          </div>
        }
      />
    </Card>
  );
}
