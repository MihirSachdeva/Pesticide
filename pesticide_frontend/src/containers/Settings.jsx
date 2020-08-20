import React from "react";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";

import Axios from "axios";

import UtilityComponent from "../components/UtilityComponent";
import UserCard from "../components/UserCard";
import * as api_links from "../APILinks";
import HEADER_NAV_TITLES from "../header_nav_titles";

const Settings = () => {
  const [user, setUser] = React.useState();
  const [emailSubs, setEmailSubs] = React.useState();

  React.useEffect(() => {
    Axios.get(api_links.API_ROOT + "current_user/")
      .then((res) => {
        setUser(res.data[0]);
        Axios.get(api_links.API_ROOT + `email_subscriptions/${res.data[0].id}/`)
          .then((res) => {
            setEmailSubs(res.data);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }, []);

  const handleEmailSubChange = (event) => {
    const id = event.target.id;
    const value = emailSubs[id];
    Axios.patch(api_links.API_ROOT + `email_subscriptions/${user.id}/`, {
      [id]: !value,
    })
      .then((res) => {
        setEmailSubs((prevEmailSubs) => ({
          ...prevEmailSubs,
          [id]: !value,
        }));
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <UtilityComponent title={HEADER_NAV_TITLES.SETTINGS} />

      <div>
        <Card className="list-title-card" variant="outlined">
          <Typography className="list-title">Settings</Typography>
        </Card>

        <div
          className="user-card-container"
          style={{
            margin: "10px 5px",
          }}
        >
          {user && (
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
          )}
        </div>

        <div>
          <div style={{ margin: "20px" }}>
            <div style={{ fontSize: "30px" }}>Email Settings</div>
            <div>Select when you would like to get notified by email.</div>
            <div>Your email address is: {"mihir_s@pp.iitr.ac.in"}</div>
          </div>
        </div>

        {emailSubs && (
          <div style={{ margin: "20px" }}>
            <FormControl component="fieldset" style={{ display: "inherit" }}>
              <FormGroup>
                <hr className="divider2" />
                <FormControlLabel
                  value={emailSubs.on_new_project}
                  onChange={handleEmailSubChange}
                  control={
                    <Switch
                      color="secondary"
                      id="on_new_project"
                      checked={emailSubs.on_new_project}
                    />
                  }
                  label="When a new project is created"
                  labelPlacement="end"
                />
                <hr className="divider2" />
                <FormControlLabel
                  value={emailSubs.on_project_membership}
                  onChange={handleEmailSubChange}
                  control={
                    <Switch
                      color="secondary"
                      id="on_project_membership"
                      checked={emailSubs.on_project_membership}
                    />
                  }
                  label="When you are added as a member in a project"
                  labelPlacement="end"
                />
                <hr className="divider2" />
                <FormControlLabel
                  value={emailSubs.on_project_status_change}
                  onChange={handleEmailSubChange}
                  control={
                    <Switch
                      color="secondary"
                      id="on_project_status_change"
                      checked={emailSubs.on_project_status_change}
                    />
                  }
                  label="When status of a project is changed"
                  labelPlacement="end"
                />
                <hr className="divider2" />
                <FormControlLabel
                  value={emailSubs.on_new_issue}
                  onChange={handleEmailSubChange}
                  control={
                    <Switch
                      color="secondary"
                      id="on_new_issue"
                      checked={emailSubs.on_new_issue}
                    />
                  }
                  label="When a new issue is reported in your project"
                  labelPlacement="end"
                />
                <hr className="divider2" />
                <FormControlLabel
                  value={emailSubs.on_issue_assign}
                  onChange={handleEmailSubChange}
                  control={
                    <Switch
                      color="secondary"
                      id="on_issue_assign"
                      checked={emailSubs.on_issue_assign}
                    />
                  }
                  label="When an issue is assigned to you"
                  labelPlacement="end"
                />
                <hr className="divider2" />
                <FormControlLabel
                  value={emailSubs.on_issue_status_change}
                  onChange={handleEmailSubChange}
                  control={
                    <Switch
                      color="secondary"
                      id="on_issue_status_change"
                      checked={emailSubs.on_issue_status_change}
                    />
                  }
                  label="When status of an issue is changed, either that you reported or are it's project member"
                  labelPlacement="end"
                />
                <hr className="divider2" />
                <FormControlLabel
                  value={emailSubs.on_new_comment}
                  onChange={handleEmailSubChange}
                  control={
                    <Switch
                      color="secondary"
                      id="on_new_comment"
                      checked={emailSubs.on_new_comment}
                    />
                  }
                  label="When a new comment is created in an issue, either that you reported, or are assigned, or are it's project member"
                  labelPlacement="end"
                />
                <hr className="divider2" />
              </FormGroup>
            </FormControl>
          </div>
        )}
      </div>
    </>
  );
};

export default Settings;
