import { Box, Button, Tooltip } from '@material-ui/core';
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

  AdminControls = () => {
    if (!this.props.master) { return null; }
    return (
      <Tooltip title="Temporarily unavailable to decrease server load">
        <div className="upload-button-parent">
          <div className="upload-button-wrapper">
            <button
              type="button"
              className="upload-button MuiButton-contained MuiButton-containedPrimary Mui-disabled"
              disabled
            >
              Select Mp3 file
            </button>
            <input disabled type="file" name="effect" accept=".mp3" ref={this.fileInput} />
          </div>
          <Button
            className="master-button upload-button"
            onClick={this.uploadMp3}
            color="primary"
            variant="contained"
            disabled
          >
            Play selected
          </Button>
        </div>
      </Tooltip>
    );
  };

  loadNewMp3(command: Command) {
    if (command.command === 'LoadMp3') {
      this.setState({ clip: command.param });
      this.audioTag.current?.load();
      this.audioTag.current?.play();
    }
  }

  render() {
    return (
      <div>
        {this.state?.clip && (
        <div>
          <audio controls className="filter-70" ref={this.audioTag}>
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
