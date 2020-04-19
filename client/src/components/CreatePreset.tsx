import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, FormGroup, InputLabel } from '@material-ui/core';
import { Category } from '../api';
import PresetManager from '../models/PresetManager';
import * as Helpers from '../helpers/Helpers';
import * as DummyVideoPlayer from '../helpers/DummyVideoPlayer';

interface CreatePresetProps {
  open: boolean;
  closeCallback: () => void;
}

interface CreatePresetState {
  selectedCategory: Category;
}

export default class CreatePreset extends React.Component<CreatePresetProps, CreatePresetState> {
  form: React.RefObject<HTMLFormElement>;
  titleInput: React.RefObject<HTMLInputElement>;
  lengthInput: React.RefObject<HTMLInputElement>;

  constructor(props: CreatePresetProps) {
    super(props);
    this.form = React.createRef();
    this.titleInput = React.createRef();
    this.lengthInput = React.createRef();
  }

  urlFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const urlField = event.target;
    const videoId = Helpers.youtubeUrlToVideoId(urlField.value);
    if (!videoId) {
      return;
    }
    urlField.value = videoId;
    DummyVideoPlayer.getProperties(videoId)
      .then((properties) => {
        if (this.titleInput.current && this.lengthInput.current) {
          this.titleInput.current.value = properties.title;
          this.lengthInput.current.value = properties.length.toString();
        }
      });
  };

  submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!this.form.current) {
      return;
    }
    const requestOptions = {
      method: 'POST',
      body: new FormData(this.form.current),
    };
    fetch(`${process.env.REACT_APP_HTTP_URL}/presets`, requestOptions);
    PresetManager.forceUpdate();
    this.props.closeCallback();
  };

  render() {
    return (
      <Dialog
        fullWidth
        maxWidth="lg"
        open={this.props.open}
        onClose={this.props.closeCallback}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle id="max-width-dialog-title">Create new preset</DialogTitle>
        <DialogContent>
          <form onSubmit={this.submit} className="create-new-form" ref={this.form}>
            <FormGroup>
              <TextField
                label="Video name"
                variant="outlined"
                name="name"
              />
            </FormGroup>
            <FormGroup>
              <TextField
                label="Youtube URL"
                variant="outlined"
                name="url"
                onChange={this.urlFieldChange}
              />
            </FormGroup>
            <FormGroup>
              <TextField
                InputProps={{
                  readOnly: true,
                }}
                label="Video Title"
                variant="outlined"
                name="title"
                value=" "
                inputRef={this.titleInput}
              />
            </FormGroup>
            <FormGroup>
              <TextField
                InputProps={{
                  readOnly: true,
                }}
                label="Video length"
                variant="outlined"
                name="length"
                value=" "
                inputRef={this.lengthInput}
              />
            </FormGroup>
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <FormGroup>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Category"
                name="category"
              >
                {PresetManager.getCachedCategories().map((category) =>
                  <MenuItem value={category._id}>{`${category.name} (${category.role})`}</MenuItem>)}
              </Select>
            </FormGroup>
            <FormGroup>
              <Button type="submit" color="primary" variant="contained">
                Create
              </Button>
            </FormGroup>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.closeCallback} color="default">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
