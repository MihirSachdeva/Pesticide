import React from "react";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const TitleCard = (props) => {
  const magic = {
    backgroundImage:
      props.theme == "palpatine"
        ? "url(../vader.jpg)"
        : `radial-gradient(rgba(121, 121, 121, 0.2) 20%,transparent 0)`,
    backgroundSize: props.theme == "palpatine" ? "cover" : "25px 25px",
    backgroundPosition: "center",
  };
  return (
    <Card className="list-title-card" variant="outlined" style={magic}>
      <Typography className="list-title">{props.title}</Typography>
    </Card>
  );
};

const mapStateToProps = (state) => {
  return {
    theme: state.theme.theme || "default",
  };
};

export default withRouter(connect(mapStateToProps, null)(TitleCard));
