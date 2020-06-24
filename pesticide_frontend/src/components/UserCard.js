import React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Skeleton from '@material-ui/lab/Skeleton';

import { Link } from "react-router-dom";

export default function UserCard(props) {

  return (
    <span>
      <Card
        style={{
          borderRadius: "15px",
          margin: "20px",
        }}
        className="user-card"
      >
        <CardHeader
          avatar={
            <img style={{
              maxWidth: "150px",
              borderRadius: "30px",
              padding: "4px",
            }}
              src={props.display_photo || '../sunglasses.svg'}
              alt="User"
            />
          }

          title={
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: '25px' }}>
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
                      'Hub Coordinator',
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
              <br />
              <span>{props.branch ?
                props.branch
                :
                <Skeleton width={140} animation="wave" />
              }</span>
              <br />
            </div>
          }
        />
      </Card>
    </span>
  );
}
