import React from 'react';
import Communication from './Communication';
import { VideoRole, Command, State, StateMessage } from '../api';
import * as VideoPlayer from './videoPlayer';
import * as Helpers from '../helpers/Helpers';

interface AdminProps {
  role: VideoRole;
}

class Admin extends React.Component<AdminProps, {}> {
  role: VideoRole;
  videoUrl = '';
  seekSlider: React.RefObject<HTMLInputElement>;
  volumeSlider: React.RefObject<HTMLInputElement>;

  constructor(props: AdminProps) {
    super(props);
    this.role = props.role;
    this.seekSlider = React.createRef();
    this.volumeSlider = React.createRef();
  }

  componentDidMount() {
    Communication.subscribe('command', (message) => this.receivedCommand(message as Command));
    Communication.subscribe('state', (message) => this.receivedState((message as StateMessage).state));
    VideoPlayer.subscribeVideoLoaded(this.role, this.setSeekValue);
  }

  pauseCommand = () => {
    Communication.sendCommand('Pause', this.role, '');
  };

  resumeCommand = () => {
    Communication.sendCommand('Resume', this.role, '');
  };

  loadCommand = () => {
    const videoId = Helpers.youtubeUrlToVideoId(this.videoUrl);
    if (!videoId) {
      return;
    }
    Communication.sendCommand('LoadVideo', this.role, videoId);
    if (Helpers.youtubeUrlToTiming(this.videoUrl) !== 0) {
      setTimeout(() => {
        Communication.sendCommand('SeekTo', this.role, Helpers.youtubeUrlToTiming(this.videoUrl).toString());
      }, 500);
    }
  };

  volumeCommand = (volume: number) => {
    Communication.sendCommand('Volume', this.role, volume.toString());
  };

  seekCommand = (percent: number) => {
    const time = (percent / 100) * VideoPlayer.getDuration(this.role);
    Communication.sendCommand('SeekTo', this.role, time.toString());
  };

  receivedCommand = (command: Command) => {
    if (command.command === 'Volume' && command.role === this.role) {
      this.setVolumeValue(command.param);
    } else if (command.command === 'SeekTo' && command.role === this.role) {
      this.setSeekValue(+command.param);
    }
  };

  receivedState = (state: State) => {
    this.setVolumeValue(state[this.role].masterVolume.toString());
    this.setSeekValue(state[this.role].time.elapsed ?? 0);
  };

  setVolumeValue = (percent: string) => {
    if (this.volumeSlider.current) {
      this.volumeSlider.current.value = percent;
    }
  };

  setSeekValue = (time: number) => {
    if (this.seekSlider.current) {
      this.seekSlider.current.value = ((time / VideoPlayer.getDuration(this.role)) * 100).toString();
    }
  };

  render() {
    return (
      <div>
        <div>
          <span className="uk-padding">Master volume</span>
          <input
            type="range"
            className="uk-range master-slider uk-align-center"
            min="0"
            max="300"
            defaultValue={VideoPlayer.getMasterVolume(this.role)}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => this.volumeCommand(+e.target.value)}
            ref={this.volumeSlider}
          />
        </div>
        <div>
          <span className="uk-padding">Seek ahead</span>
          <input
            type="range"
            className="uk-range master-slider uk-align-center"
            min="0"
            max="100"
            onMouseUp={(e) => this.seekCommand(+(e.target as (EventTarget & HTMLInputElement)).value)}
            ref={this.seekSlider}
          />
        </div>
        <div>
          <input
            type="text"
            id={`${this.role}videoUrl`}
            className="uk-input"
            placeholder="https://www.youtube.com/watch?v=TbOWuXD2QFo"
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => { this.videoUrl = e.target.value; }}
          />
        </div>
        <div className="uk-inline">
          <button type="button" className="master-button uk-button" onClick={this.loadCommand}>Load</button>
          <button type="button" className="master-button uk-button" onClick={this.resumeCommand}>Play</button>
          <button type="button" className="master-button uk-button" onClick={this.pauseCommand}>Pause</button>
        </div>
      </div>
    );
  }
}

export default Admin;
