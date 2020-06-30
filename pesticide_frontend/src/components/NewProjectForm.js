import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';

import axios from 'axios';

import { EditorState } from 'draft-js';
import { DraftailEditor, BLOCK_TYPE, INLINE_STYLE } from 'draftail';
import { stateToHTML } from 'draft-js-export-html';
import "draft-js/dist/Draft.css";
import "draftail/dist/draftail.css";

import * as api_links from '../APILinks';


export default function NewProjectForm(props) {

  const [formData, setFormData] = React.useState({
    name: "",
    status: "",
    link: ""
  });

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevValue => ({
      ...prevValue,
      [name]: value
    }));
  }

  const [personsID, setPersonsID] = React.useState([]);

  const handleMembersChange = (event) => {
    setPersonsID(event.target.value);
  };


  const [userList, setUserList] = React.useState([]);

  async function fetchUserListFromAPI() {
    axios.get(api_links.API_ROOT + 'users/')
      .then(res => {
        setUserList(res.data);
      })
      .catch(err => console.log(err));
  }

  const [projectImage, setProjectImage] = React.useState(null);

  const handleImageChange = (event) => {
    setProjectImage(event.target.files[0]);
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    let data = {
      name: formData.name,
      wiki: stateToHTML(editorState.getCurrentContent()),
      timestamp: new Date(),
      link: formData.link,
      status: formData.status,
      members: personsID
    };
    const token = localStorage.getItem('token');
    axios.defaults.headers = {
      'Content-Type': 'application/json',
      Authorization: 'Token  ' + token
    }
    axios.post(api_links.API_ROOT + 'projects/', data)
      .then(res => {
        let audio = new Audio('../sounds/navigation_selection-complete-celebration.wav');
        audio.play();
        setTimeout(() => {
          if (projectImage !== null && res.status == 201) {
            let project_id = res.data.id;
            data = new FormData();
            data.append('project', project_id);
            data.append('image', projectImage, projectImage.name)
            axios.defaults.headers = {
              'Content-Type': 'multipart/form-data',
              Authorization: 'Token  ' + token
            }
            axios.post(api_links.API_ROOT + 'projecticons/', data)
              .then(res => {
                console.log(res);
                window.location.reload();
              })
              .catch(err => {
                console.log(err);
                let audio = new Audio('../sounds/alert_error-03.wav');
                audio.play();
              });
          }
        }, 2000);
        window.location.reload();

      })
      .catch(err => {
        console.log(err);
        let audio = new Audio('../sounds/alert_error-03.wav');
        audio.play();
      });
  }

  React.useEffect(() => {
    fetchUserListFromAPI();
  }, []);

  const [editorState, setEditorState] = React.useState(EditorState.createEmpty());

  const handleRichTextChange = editorState => {
    setEditorState(editorState);
  }

  const statusOptions = ["Testing", "Deployed", "Production", "Development", "Scrapped", "Finished"];

  return (
    <Container component="main" maxWidth="xs">
      <div style={{ margin: "20px 5px" }}>
        <form noValidate onSubmit={handleFormSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                variant="outlined"
                fullWidth
                id="projectname"
                label="Project Name"
                value={formData.name}
                onChange={handleFormChange}
              />
            </Grid>

            <Grid item xs={12} className="custom-form-outline-padding-none">
              <Typography style={{ padding: "5px" }}>Wiki (RichText)</Typography>
              <DraftailEditor
                editorState={editorState}
                onChange={handleRichTextChange}
                blockTypes={[
                  { type: BLOCK_TYPE.HEADER_THREE },
                  { type: BLOCK_TYPE.UNORDERED_LIST_ITEM },
                  { type: BLOCK_TYPE.ORDERED_LIST_ITEM },
                ]}
                inlineStyles={[
                  { type: INLINE_STYLE.BOLD },
                  { type: INLINE_STYLE.ITALIC },
                  { type: INLINE_STYLE.UNDERLINE },
                  { type: INLINE_STYLE.CODE },
                  { type: INLINE_STYLE.STRIKETHROUGH },
                ]}
              />
            </Grid>

            <Grid item xs={12} className="custom-form-outline-padding-none">
              <Typography style={{ padding: "5px" }}>Logo (SVG not supported yet 😅)</Typography>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Grid>


            <Grid item xs={12} className="custom-form-outline">

              <InputLabel id="demo-mutiple-chip-label" >Add Members</InputLabel>
              <Select

                labelId="mutiple-chip-label"
                id="mutiple-chip"
                multiple
                value={personsID}
                onChange={handleMembersChange}
                input={<Input id="select-multiple-chip" />}
                renderValue={(selected) => (
                  <div >
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={userList.filter((user, index) => user.id == value)[0].name}
                        style={{ margin: '5px', borderRadius: '10px' }}
                      />
                    ))}
                  </div>
                )}

              >
                {userList.map((user) => (
                  <MenuItem key={user.name} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>

            </Grid>

            <Grid item xs={12} className="custom-form-outline">

              <InputLabel id="single-select-outlined-label">Status</InputLabel>
              <Select
                labelId="single-select-outlined-label"
                id="single-select-outlined"
                value={formData.status}
                onChange={handleFormChange}
                label="Status"
                name="status"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {statusOptions.map(option => <MenuItem value={option}>{option}</MenuItem>)}
              </Select>

            </Grid>

            <Grid item xs={12}>
              <TextField
                name="link"
                variant="outlined"
                fullWidth
                id="projectlink"
                label="Project Link"
                value={formData.link}
                onChange={handleFormChange}
              />
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              style={{ marginTop: "20px" }}

            >
              Create Project
                </Button>
          </Grid>
        </form>
      </div>
    </Container>
  );
}