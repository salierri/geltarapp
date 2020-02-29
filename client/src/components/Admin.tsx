import React from 'react';
import Communication, { CommandType } from './Communication';
import { VideoProps } from './Video';
import { VideoType } from '../server';

class Admin extends React.Component<VideoProps, Object> {

    role: VideoType;
    videoUrl: string = "";

    constructor(props: VideoProps) {
        super(props);
        this.role = props.role;
    }

    pauseCommand() {
        Communication.sendCommand(CommandType.Pause, this.role, "");
    }

    resumeCommand() {
        Communication.sendCommand(CommandType.Resume, this.role, "");
    }

    loadCommand() {
        Communication.sendCommand(CommandType.LoadVideo, this.role, this.videoUrl.slice(-11));
    }

    volumeCommand(volume: number) {
        Communication.sendCommand(CommandType.Volume, this.role, volume.toString());
    }

    seekCommand(percent: number) {
        Communication.sendCommand(CommandType.SeekTo, this.role, percent.toString());
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
                     onMouseUp={(e: React.ChangeEvent<HTMLInputElement>) => this.seekCommand(+e.target.value) } />
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

export default Admin;