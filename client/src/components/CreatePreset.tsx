import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, FormGroup, InputLabel } from '@material-ui/core';
import PresetManager from '../models/PresetManager';
import * as Helpers from '../helpers/Helpers';
import * as DummyVideoPlayer from '../helpers/DummyVideoPlayer';

interface CreatePresetProps {
  open: boolean;
  closeCallback: () => void;
}

export default class CreatePreset extends React.Component<CreatePresetProps, {}> {
  form: React.RefObject<HTMLFormElement>;
  titleInput: React.RefObject<HTMLInputElement>;
  hiddenVideoIdInput: React.RefObject<HTMLInputElement>;
  hiddenLengthInput: React.RefObject<HTMLInputElement>;
  niceLengthInput: React.RefObject<HTMLInputElement>;

  constructor(props: CreatePresetProps) {
    super(props);
    this.form = React.createRef();
    this.titleInput = React.createRef();
    this.hiddenVideoIdInput = React.createRef();
    this.hiddenLengthInput = React.createRef();
    this.niceLengthInput = React.createRef();
  }

  urlFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const urlField = event.target;
    const videoId = Helpers.youtubeUrlToVideoId(urlField.value);
    if (!videoId) {
      return;
    }
    DummyVideoPlayer.getProperties(videoId)
      .then((properties) => {
        if (this.titleInput.current
          && this.hiddenVideoIdInput.current
          && this.hiddenLengthInput.current
          && this.niceLengthInput.current) {
          this.hiddenVideoIdInput.current.value = videoId;
          this.titleInput.current.value = properties.title;
          this.hiddenLengthInput.current.value = properties.length.toString();
          this.niceLengthInput.current.value = Helpers.numberToTimeString(properties.length);
        }
      });
  };

  submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!this.form.current) {
      return;
    }
    const requestOptions: RequestInit = {
      method: 'POST',
      body: new FormData(this.form.current),
      credentials: 'include',
    };
    await fetch(`${process.env.REACT_APP_HTTP_URL}/presets`, requestOptions);
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
                required
                label="Video name"
                variant="outlined"
                name="name"
                autoFocus
              />
            </FormGroup>
            <FormGroup>
              <TextField
                required
                label="Youtube URL"
                variant="outlined"
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
                defaultValue=" "
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
                defaultValue=" "
                inputRef={this.niceLengthInput}
              />
            </FormGroup>
            <InputLabel id="category-select-label">Category</InputLabel>
            <FormGroup>
              <Select
                labelId="category-select-label"
                name="category"
                defaultValue={PresetManager.getCachedCategories()[0]?._id}
              >
                {PresetManager.getCachedCategories().map((category) =>
                  <MenuItem value={category._id} key={category._id}>{`${category.name} (${category.role})`}</MenuItem>)}
              </Select>
            </FormGroup>
            <FormGroup>
              <Button type="submit" color="primary" variant="contained">
                Create
              </Button>
            </FormGroup>
            <input type="hidden" name="length" ref={this.hiddenLengthInput} />
            <input type="hidden" name="url" ref={this.hiddenVideoIdInput} />
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
