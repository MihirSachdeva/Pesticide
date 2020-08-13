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
import FormControl from '@material-ui/core/FormControl';

import axios from 'axios';
import * as api_links from '../APILinks';

import { Editor, EditorState, ContentState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import { convertFromHTML, convertToHTML } from 'draft-convert';
import { DraftailEditor, BLOCK_TYPE, INLINE_STYLE, ENTITY_TYPE } from 'draftail';
import { stateToHTML } from 'draft-js-export-html';
import "draft-js/dist/Draft.css";
import "draftail/dist/draftail.css";

export default function NewIssueForm(props) {

  const [userList, setUserList] = React.useState([]);
  async function fetchUserListFromAPI() {
    axios.get(api_links.API_ROOT + 'users/')
      .then(res => {
        setUserList(res.data);
      })
      .catch(err => console.log(err));
  }

  const [tags, setTags] = React.useState([]);
  async function fetchTagListFromAPI() {
    axios.get(api_links.API_ROOT + 'tags/')
      .then(res => {
        setTags(res.data);
      })
      .catch(err => console.log(err));
  }

  const [tagsID, setTagsID] = React.useState([]);
  const handleTagsChange = (event) => {
    setTagsID(event.target.value);
  };


  const [editorState, setEditorState] = React.useState(EditorState.createEmpty());
  const handleRichTextChange = editorState => {
    setEditorState(editorState);
  }

  const [formData, setFormData] = React.useState({
    title: "",
    // assigned_to: ""
  });

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevValue => ({
      ...prevValue,
      [name]: value
    }));
  }

  const [issueImage, setIssueImage] = React.useState(null);

  const handleImageChange = (event) => {
    setIssueImage(event.target.files[0]);
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    let data = {
      title: formData.title,
      description: stateToHTML(editorState.getCurrentContent()),
      timestamp: new Date(),
      // assigned_to: formData.assigned_to,
      project: props.project,
      tags: tagsID,
    };

    axios.post(api_links.API_ROOT + 'issues/', data)
      .then(res => {
        let audio = new Audio('../sounds/navigation_selection-complete-celebration.wav');
        audio.play();
        setTimeout(() => {
          if (issueImage !== null && res.status == 201) {
            let issue_id = res.data.id;
            data = new FormData();
            data.append('issue', issue_id);
            data.append('image', issueImage, issueImage.name)
            axios.post(api_links.API_ROOT + 'issueimages/', data)
              .then(res => console.log(res))
              .catch(err => {
                console.log(err);
                let audio = new Audio('../sounds/alert_error-03.wav');
                audio.play();
              });
          }
          props.getIssues();
          props.handleClose();
        }, 1000);
      })
      .catch(err => {
        console.log(err);
        let audio = new Audio('../sounds/alert_error-03.wav');
        audio.play();
      });

    
  }

  React.useEffect(() => {
    // fetchUserListFromAPI();
    fetchTagListFromAPI();
  }, []);

  return (
    <>
      <Container component="main" maxWidth="xs">
        <div style={{ margin: "20px 5px" }}>
          <form noValidate onSubmit={handleFormSubmit}>
            <Grid container spacing={2}>

              <Typography className="form-label">Title</Typography>
              <Grid item xs={12} className="custom-form-outline-padding-none">
                <TextField
                  name="title"
                  fullWidth
                  id="issuetitle"
                  onChange={handleFormChange}
                />
              </Grid>

              <Typography className="form-label">Description</Typography>
              <Grid item xs={12} className="custom-form-outline-padding-none">
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

              <Typography className="form-label">Image</Typography>
              <Grid item xs={12} className="custom-form-outline-padding-none">
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Grid>

              {/* <Typography className="form-label">Assign to</Typography>
              <Grid item xs={12} className="custom-form-outline">
                <Select
                  labelId="single-select-outlined-label"
                  id="single-select-outlined"
                  value={formData.assigned_to}
                  onChange={handleFormChange}
                  label="Assigned To"
                  name="assigned_to"
                >
                  <MenuItem value="">
                    <em>Select a user</em>
                  </MenuItem>
                  {userList.map(user => <MenuItem value={user.id}>{user.name}</MenuItem>)}
                </Select>

              </Grid> */}

              <Typography className="form-label">Tags</Typography>
              <Grid item xs={12} className="custom-form-outline">
                <Select
                  labelId="mutiple-chip-label"
                  id="mutiple-chip"
                  multiple
                  style={{maxWidth: '350px'}}
                  value={tagsID}
                  onChange={handleTagsChange}
                  input={<Input id="select-multiple-chip" />}
                  renderValue={(selected) => {
                    let o = {};
                    tags.map(obj => {
                      o[obj.id] = obj.tag_text;
                    });
                    return (
                      <div >
                        {selected.map((value) => (
                          <Chip label={o[value]} key={value} style={{ margin: "5px", borderRadius: '10px' }} />
                        ))}
                      </div>
                    )
                  }}

                >
                  {tags.map((tag) => (
                    <MenuItem key={tag.tag_text} value={tag.id}>
                      <div
                        style={{
                          color: tag.color,
                          fontWeight: '900'
                        }}
                      >
                        <span className='issue-tag-text'>{"#" + tag.tag_text}</span>
                      </div>

                    </MenuItem>
                  ))}
                </Select>

              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                style={{ marginTop: "20px" }}

              >
                Add Issue
              </Button>
            </Grid>
          </form>
        </div>
      </Container>

    </>
  );
}