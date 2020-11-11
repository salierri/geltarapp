import React from 'react';
import { Button, Snackbar } from '@material-ui/core';
import Communication from './Communication';
import { Suggestion } from '../api';
import * as DummyVideoPlayer from '../helpers/DummyVideoPlayer';

interface ApproveSuggestionState {
  open: boolean;
  videoTitle: string;
  videoUrl: string;
}

export default class ApproveSuggestion extends React.Component<{}, ApproveSuggestionState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      open: false,
      videoTitle: '',
      videoUrl: '',
    };
  }

  approveVideo = () => {
    Communication.sendCommand('LoadVideo', 'music', this.state.videoUrl);
    this.setState({ open: false });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  componentDidMount = () => {
    Communication.subscribe('suggestion', (suggestion) => {
      const videoUrl = (suggestion as Suggestion).video;
      DummyVideoPlayer.getProperties(videoUrl)
      .then((properties) => {
        this.setState({ open: true, videoUrl: (suggestion as Suggestion).video, videoTitle: properties.title })
      });
    });
  }

  render() {
    const action = <Button color="primary" size="small" onClick={this.approveVideo}>
                      Play video
                    </Button>
    return (
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={this.state.open}
        onClose={this.handleClose}
        message={this.state.videoTitle}
        action={action}
      />
    );
  }
}
