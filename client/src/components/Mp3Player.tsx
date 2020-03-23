import React from 'react';
import '../style/Mp3Player.css';
import * as Axios from 'axios';
import Communication from './Communication';
import { Command } from '../api';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

interface Mp3State {
    clip: string
}

class Mp3Player extends React.Component<{}, Mp3State> {

    audioTag: React.RefObject<HTMLAudioElement>;

    constructor({}) {
        super({});
        this.audioTag = React.createRef();
    }

    uploadMp3 = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(!event.target.files) {
            return;
        }
        let data = new FormData();
        data.append('effect', event.target.files[0]);

        Axios.default.post(`${process.env.REACT_APP_SERVER_URL}/mp3/upload`, data)
         .then((response) => {
            console.log(response);
         });
    }

    loadNewMp3(command: Command) {
        if(command.command === 'LoadMp3') {
            this.setState({clip: command.param});
            this.audioTag.current?.load();
            this.audioTag.current?.play();
        }
    }

    componentDidMount() {
        Communication.subscribe('command', (message) => this.loadNewMp3(message as Command));
    }

    render() {
        return (
            <div>
                {this.state?.clip && <div>
                        <audio controls className="uk-align-center" ref={this.audioTag}>
                            <source src={`${process.env.REACT_APP_SERVER_URL}/${this.state.clip}`} type="audio/mpeg" />
                        </audio>
                     </div>}
                <BrowserRouter>
                <Switch>
                <Route path="/geltaradmin">
                    <div className="uk-align-center upload-button-parent">
                        <div className="upload-button-wrapper">
                            <button className="uk-button upload-button">Upload Mp3 file</button>
                            <input type="file" name="effect" accept=".mp3" onChange={ this.uploadMp3 } />
                        </div>
                    </div>
                </Route>
                </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

export default Mp3Player;
