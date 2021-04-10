import { Button, ButtonGroup, FormControl, FormLabel, Grid, TextField } from '@material-ui/core';
import React from 'react';
import { Command, State, StateMessage, VideoRole } from '../api';
import * as Helpers from '../helpers/Helpers';
import Communication from './Communication';
import * as VideoPlayer from './videoPlayer';

interface AdminProps {
  role: VideoRole;
}

class Admin extends React.Component<AdminProps, {}> {
  role: VideoRole;
  videoUrl = '';
  seekSlider: React.RefObject<HTMLInputElement>;
  seekNumber: React.RefObject<HTMLParagraphElement>;
  volumeSlider: React.RefObject<HTMLInputElement>;
  volumeNumber: React.RefObject<HTMLParagraphElement>;

  constructor(props: AdminProps) {
    super(props);
    this.role = props.role;
    this.seekSlider = React.createRef();
    this.volumeSlider = React.createRef();
    this.seekNumber = React.createRef();
    this.volumeNumber = React.createRef();
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
    if (this.volumeSlider.current && this.volumeNumber.current) {
      this.volumeSlider.current.value = percent;
      this.volumeNumber.current.innerText = percent + "%";
    }
  };

  setSeekValue = (time: number) => {
    if (this.seekSlider.current && this.seekNumber.current) {
      this.seekSlider.current.value = ((time / VideoPlayer.getDuration(this.role)) * 100).toString();
      this.seekNumber.current.innerText = Helpers.toHHMMSS(time);
    }
  };

  blueButton = (label: string, callback: () => void) =>
    (
      <Button
        className="master-button"
        onClick={callback}
      >
        {label}
      </Button>
    );

  render() {
    return (
      <>
        {/* We have to use traditional input fields, because Material UI is crazy slow with the continous rerenders */}
        <div className="master-slider-container">
          <FormLabel>Master volume</FormLabel>
          <input
            type="range"
            className="uk-range master-slider uk-align-center"
            min="0"
            max="300"
            defaultValue={VideoPlayer.getMasterVolume(this.role)}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => this.volumeCommand(+e.target.value)}
            ref={this.volumeSlider}
          />
          <p className="inline left-margin" ref={this.volumeNumber}>100</p>
        </div>
        <div className="master-slider-container">
          <FormLabel>Seek ahead</FormLabel>
          <input
            type="range"
            className="uk-range master-slider uk-align-center"
            min="0"
            max="100"
            onMouseUp={(e) => this.seekCommand(+(e.target as (EventTarget & HTMLInputElement)).value)}
            ref={this.seekSlider}
          />
          <p className="inline left-margin" ref={this.seekNumber}>0</p>
        </div>
        <FormControl fullWidth>
          <TextField
            id={`${this.role}videoUrl`}
            placeholder="https://www.youtube.com/watch?v=TbOWuXD2QFo"
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => { this.videoUrl = e.target.value; }}
          />
        </FormControl>
        <Grid container justify="center" spacing={0}>
          <ButtonGroup variant="contained" color="primary">
            {this.blueButton('Load', this.loadCommand)}
            {this.blueButton('Pause', this.pauseCommand)}
            {this.blueButton('Unpause', this.resumeCommand)}
          </ButtonGroup>
        </Grid>
      </>
    );
  }
}

export default Admin;
