import React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import ArrowBackRoundedIcon from '@material-ui/icons/ArrowBackRounded';
import Button from "@material-ui/core/Button";

export default function RecipeReviewCard() {

  return (
    <div>
      <Card style={{borderRadius: 0}}>
        <CardHeader
          title={
            <div style={{display: 'flex', alignItems: 'center'}}>
                <Button
                    startIcon= {<ArrowBackRoundedIcon />}
                    variant="outlined"
                    style={{ textTransform: "none", margin: "0 5px" }}
                >
                Back
                </Button>
                <div style={{ fontSize: 17, marginLeft: '10px' }}>
                Slambook › Issue 3
                </div>
            </div>
          }
        />
      </Card>

      </div>
  );
}
