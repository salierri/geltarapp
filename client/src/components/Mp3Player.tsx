import { Box, Button } from '@material-ui/core';
import * as Axios from 'axios';
import React from 'react';
import { Command } from '../api';
import '../style/Mp3Player.css';
import Communication from './Communication';

interface Mp3Props {
  master: boolean;
}

interface Mp3State {
  clip: string;
}

class Mp3Player extends React.Component<Mp3Props, Mp3State> {
  audioTag: React.RefObject<HTMLAudioElement>;
  fileInput: React.RefObject<HTMLInputElement>;

  constructor(props: Mp3Props) {
    super(props);
    this.audioTag = React.createRef();
    this.fileInput = React.createRef();
  }

  componentDidMount() {
    Communication.subscribe('command', (message) => this.loadNewMp3(message as Command));
  }

  uploadMp3 = () => {
    const file = this.fileInput.current?.files?.[0];
    if (!file) {
      return;
    }
    const data = new FormData();
    data.append('effect', file);

    Axios.default.post(`${process.env.REACT_APP_HTTP_URL}/mp3/upload`, data)
      .then((response) => {
        console.log(`Upload success: ${response}`);
      })
      .catch((reason) => {
        console.log(`Upload fail: ${reason}`);
      });
  };

  loadNewMp3(command: Command) {
    if (command.command === 'LoadMp3') {
      this.setState({ clip: command.param });
      this.audioTag.current?.load();
      this.audioTag.current?.play();
    }
  }

  AdminControls = () => {
    if (!this.props.master) { return null; }
    return (
      <div className="uk-align-center upload-button-parent">
      <div className="upload-button-wrapper">
        <button type="button" className="uk-button upload-button MuiButton-containedPrimary">Select Mp3 file</button>
        <input type="file" name="effect" accept=".mp3" ref={this.fileInput} />
      </div>
      <Button
        className="master-button upload-button"
        onClick={this.uploadMp3}
        color="primary"
        variant="contained"
      >
        Play selected
      </Button>
    </div>
    );
  }

  render() {
    return (
      <div>
        {this.state?.clip && (
        <div>
          <audio controls className="uk-align-center filter-70" ref={this.audioTag}>
            <source src={`${process.env.REACT_APP_HTTP_URL}/${this.state.clip}`} type="audio/mpeg" />
          </audio>
        </div>
        )}
        <Box mt={2}>
          <this.AdminControls />
        </Box>
      </div>
    );
  }
}

export default Mp3Player;
