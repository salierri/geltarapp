import React from 'react';
import Communication from './Communication';
import { VideoProps } from './Video';
import { VideoType } from '../api';
import { getDuration } from './videoPlayer';

class Admin extends React.Component<VideoProps, Object> {

    role: VideoType;
    videoUrl: string = "";

    constructor(props: VideoProps) {
        super(props);
        this.role = props.role;
    }

    pauseCommand() {
        Communication.sendCommand("Pause", this.role, "");
    }

    resumeCommand() {
        Communication.sendCommand("Resume", this.role, "");
    }

    loadCommand() {
        Communication.sendCommand("LoadVideo", this.role, urlToVideoId(this.videoUrl));
    }

    volumeCommand(volume: number) {
        Communication.sendCommand("Volume", this.role, volume.toString());
    }

    seekCommand(percent: number) {
        let time = (percent / 100) * getDuration(this.role);
        Communication.sendCommand("SeekTo", this.role,  time.toString());
    }

    render() {
        return (
            <div>
                <div>
                    <span className="uk-padding">Master volume</span>
                    <input type="range" className="uk-range master-slider uk-align-center" min="0" max="300" defaultValue="100"
                     onInput={(e: React.ChangeEvent<HTMLInputElement>) => this.volumeCommand(+e.target.value) } />
                </div>
                <div>
                    <span className="uk-padding">Seek ahead</span>
                    <input type="range" className="uk-range master-slider uk-align-center" min="0" max="100" defaultValue="0"
                     onMouseUp={(e) => this.seekCommand(+(e.target as (EventTarget & HTMLInputElement)).value) } />
                </div>
                <div>
                    <input type="text" id={this.role + "videoUrl"} className="uk-input" placeholder="https://www.youtube.com/watch?v=TbOWuXD2QFo"
                    onInput={ (e: React.ChangeEvent<HTMLInputElement>) => this.videoUrl = e.target.value } />
                </div>
                <div className="uk-inline">
                    <button className="master-button uk-button" onClick={() => this.loadCommand()}>Load</button>
                    <button className="master-button uk-button" onClick={() => this.resumeCommand()}>Play</button>
                    <button className="master-button uk-button" onClick={() => this.pauseCommand()}>Pause</button>
                </div>
            </div>
        );
    }
}

function urlToVideoId(url: string) {
    return url.slice(-11);
}

export default Admin;
