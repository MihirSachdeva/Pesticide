import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

const isMobile = window.innerWidth < 850;

const Settings = (props) => {

  return (
    <>
      <div>
            
        <div>
          <div style={{fontSize: "30px", margin: "10px 0 0 10px"}}>
            My Account
          </div>
          
          <div className="settings-user-info">              
              <div className="settings-user-avatar">
                <div className="settings-user-image">
                  <img src="./mihir.jpg" alt="User Profile Pic" />
                </div>
                <div className="settings-user-details">
                  <div style={{fontSize: "25px"}}>Mihir Sachdeva</div>
                  <div>Developer, Admin</div>
                  <div>B.Tech. CH</div>
                  <div>First Year</div>
                </div>                                          
              </div>
              <div className="settings-user-username">
                <form method="POST" className="settings-username-form" autocomplete="off"  >

                    <div>Username:</div>
                    <Input type="text" value="mihir" name="username" className="settings-username-username" />
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                    >
                      <SaveIcon />
                      {!isMobile && "Save"}
                    </Button>
                </form>
              </div>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<SaveIcon />}
                style={{margin: "10px"}}
              >
                Logout
              </Button>
          </div>
        </div>

        <div>
          <div style={{margin: "10px"}}>
            <div style={{fontSize: "30px"}}>Email Settings</div>
            <div>Select when you would like to get notified by email.</div>
            <div>Your email address is: {"mihir_s@pp.iitr.ac.in"}</div>
          </div>
        </div>

        <FormControl component="fieldset" style={{margin: "20px"}}>
          <FormGroup>
              <FormControlLabel
                value="start"
                control={<Switch color="secondary" />}
                label="On new issue on your project"
                labelPlacement="end"
              />
              <br />
              <FormControlLabel
                value="start"
                control={<Switch color="secondary" />}
                label="On new comment on an issue you reported"
                labelPlacement="end"
              />
              <br />
              <FormControlLabel
                value="start"
                control={<Switch color="secondary" />}
                label="On change of status on an issue you reported"
                labelPlacement="end"
              />
          </FormGroup>
        </FormControl>

      </div>
    </>
  );
}

export default Settings;