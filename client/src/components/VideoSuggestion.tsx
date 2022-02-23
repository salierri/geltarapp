import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormGroup, TextField } from '@material-ui/core';
import Communication from './Communication';
import * as Helpers from '../helpers/Helpers';

interface VideoSuggestionState {
  open: boolean;
}

export default class VideoSugggestion extends React.Component<{}, VideoSuggestionState> {
  videoUrl = '';

  constructor(props: {}) {
    super(props);
    this.state = {
      open: false,
    };
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  sendSuggestion = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    Communication.send({ type: 'suggestion', video: Helpers.youtubeUrlToVideoId(this.videoUrl) ?? '' });
    this.handleClose();
  };

  render() {
    return (
      <>
        <Button variant="contained" color="primary" onClick={this.handleClickOpen}>
          Suggest video
        </Button>
        <Dialog
          fullWidth
          maxWidth="lg"
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="max-width-dialog-title"
        >
          <DialogTitle id="max-width-dialog-title">Suggest video</DialogTitle>
          <form onSubmit={this.sendSuggestion}>
            <DialogContent>
              <FormGroup>
                <TextField
                  required
                  label="Youtube URL"
                  variant="outlined"
                  placeholder="https://www.youtube.com/watch?v=w7K61jgTT9A"
                  name="name"
                  autoFocus
                  onInput={(e: React.ChangeEvent<HTMLInputElement>) => { this.videoUrl = e.target.value; }}
                />
              </FormGroup>
            </DialogContent>
            <DialogActions>
              <Button color="primary" type="submit" variant="contained">
                Suggest
              </Button>
              <Button onClick={this.handleClose} color="default">
                Cancel
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </>
    );
  }
}
