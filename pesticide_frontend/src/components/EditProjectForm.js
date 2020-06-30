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
import { stateFromHTML } from 'draft-js-import-html';
import "draft-js/dist/Draft.css";
import "draftail/dist/draftail.css";

import ImageWithModal from './ImageWithModal';
import * as api_links from '../APILinks';

export default function EditProjectForm(props) {

  const [formData, setFormData] = React.useState({});
  const [editedFormData, setEditedFormData] = React.useState({});

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevValue => ({
      ...prevValue,
      [name]: value
    }));
    setEditedFormData(prevValue => ({
      ...prevValue,
      [name]: value
    }));
  }

  const [personsID, setPersonsID] = React.useState([]);

  const handleMembersChange = (event) => {
    setPersonsID(event.target.value);
    setEditedFormData(prevData => ({
      ...prevData,
      members: event.target.value
    }));
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
    // let data = {
    //     name: formData.name,
    //     wiki: stateToHTML(editorState.getCurrentContent()),
    //     timestamp: new Date(),
    //     link: formData.link,
    //     status: formData.status,
    //     creator: 1,
    //     members: personsID
    // };

    const token = localStorage.getItem('token');
    axios.defaults.headers = {
      'Content-Type': 'application/json',
      Authorization: 'Token  ' + token
    }
    axios.patch(api_links.API_ROOT + `projects/${props.projectID}/`, editedFormData)
      .then(res => {
        let audio = new Audio('../sounds/navigation_selection-complete-celebration.wav');
        audio.play();
        setTimeout(() => {
          if (projectImage !== null && (res.status == 200 || res.status == 202 || res.status == 204)) {
            let project_id = res.data.id;
            let data = new FormData();
            data.append('project', project_id);
            data.append('image', projectImage, projectImage.name)
            axios.defaults.headers = {
              'Content-Type': 'multipart/form-data',
              Authorization: 'Token  ' + token
            }
            if (res.data.icon[0] != undefined) {
              axios.patch(api_links.API_ROOT + `projecticons/${res.data.icon[0].id}/`, data)
                .then(res => {
                  console.log(res);
                })
                .catch(err => {
                  console.log(err);
                  let audio = new Audio('../sounds/alert_error-03.wav');
                  audio.play();
                });

            } else {
              axios.post(api_links.API_ROOT + `projecticons/`, data)
                .then(res => {
                  console.log(res);
                })
                .catch(err => {
                  console.log(err);
                  let audio = new Audio('../sounds/alert_error-03.wav');
                  audio.play();
                });

            }
          }
          window.location.href = '/projects';
        }, 1000);
      })
      .catch(err => {
        console.log(err);
        let audio = new Audio('../sounds/alert_error-03.wav');
        audio.play();
      });
  }

  const [editorState, setEditorState] = React.useState(EditorState.createEmpty());

  const handleRichTextChange = newEditorState => {
    setEditorState(newEditorState);
    setEditedFormData((prev) => ({
      ...prev,
      wiki: stateToHTML(newEditorState.getCurrentContent())
    }));
  }

  async function fetchProjectInfoFromAPI() {
    axios.get(api_links.API_ROOT + `projects/${props.projectID}/`)
      .then(res => {
        setFormData(() => ({
          name: res.data.name,
          status: res.data.status,
          link: res.data.link,
          creator: res.data.creator,
          icon: res.data.icon[0] != undefined ? res.data.icon[0].image : null
        }));
        setEditorState(EditorState.createWithContent(stateFromHTML(res.data.wiki)));
        setPersonsID(res.data.members);
      })
      .catch(err => console.log(err));
  }

  React.useEffect(() => {
    fetchUserListFromAPI();
    fetchProjectInfoFromAPI();
  }, []);


  const statusOptions = ["Testing", "Deployed", "Production", "Development", "Scrapped", "Finished"];

  return (
    <Container component="main" maxWidth="xs">
      <div style={{ margin: "20px 5px" }}>
        <form noValidate onSubmit={handleFormSubmit}>
          <Grid container spacing={2}>


            <Grid item xs={12}>
              <Typography>Project Name</Typography>
              <TextField
                name="name"
                variant="outlined"
                fullWidth
                id="projectname"
                label=""
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
              <div className="project-edit-image">
                {formData.icon ? <ImageWithModal src={formData.icon} alt="Project Icon" /> : <Typography>No logo set for this project.</Typography>}
              </div>
              <Typography style={{ padding: "5px" }}>New Logo</Typography>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Grid>

            <Grid item xs={12} className="custom-form-outline">

              <InputLabel id="demo-mutiple-chip-label" >Select Members</InputLabel>
              {
                userList !== [] &&
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
                          label={userList.filter((user, index) => user.id == value)[0] !== undefined && userList.filter((user, index) => user.id == value)[0].name}
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
              }

            </Grid>

            <Grid item xs={12} className="custom-form-outline">
              <Typography>Current Status: {formData.status}</Typography>
              <InputLabel id="single-select-outlined-label">Change Status</InputLabel>
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
              <Typography>Link: {formData.link}</Typography>
              <TextField
                name="link"
                variant="outlined"
                fullWidth
                id="projectlink"
                label=""
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
              Save
                </Button>
          </Grid>
        </form>
      </div>
    </Container>
  );
}