import React from 'react';
import '../style/Mp3Player.css';
import * as Axios from 'axios';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import Communication from './Communication';
import { Command } from '../api';

interface Mp3State {
  clip: string;
}

class Mp3Player extends React.Component<{}, Mp3State> {
  audioTag: React.RefObject<HTMLAudioElement>;
  fileInput: React.RefObject<HTMLInputElement>;

  constructor(props: {}) {
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

    Axios.default.post(`${process.env.REACT_APP_SERVER_URL}/mp3/upload`, data)
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


  render() {
    return (
      <div>
        {this.state?.clip && (
        <div>
          <audio controls className="uk-align-center filter-70" ref={this.audioTag}>
            <source src={`${process.env.REACT_APP_SERVER_URL}/${this.state.clip}`} type="audio/mpeg" />
          </audio>
        </div>
)}
        <BrowserRouter>
          <Switch>
            <Route path="/geltaradmin">
              <div className="uk-align-center upload-button-parent">
                <div className="upload-button-wrapper">
                  <button type="button" className="uk-button upload-button">Select Mp3 file</button>
                  <input type="file" name="effect" accept=".mp3" ref={this.fileInput} />
                </div>
                <button type="button" className="uk-button upload-button" onClick={this.uploadMp3}>Play selected</button>
              </div>
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default Mp3Player;
