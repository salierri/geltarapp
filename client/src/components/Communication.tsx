import { Component } from 'react';
import { w3cwebsocket as WebSocket } from "websocket";
import * as VideoPlayer from './videoPlayer';
import { Command, Message, VideoType } from '../server';

const client = new WebSocket('ws://localhost:4000/');

export enum CommandType {
    LoadVideo = 'loadVideo',
    Volume = 'volume',
    SeekTo = 'seekTo',
    Pause = 'pause',
    Resume = 'resume'
} 

class Communication extends Component {
    componentDidMount() {
        client.onopen = () => {
            console.log("client connected");
            let poause: CommandType = CommandType.Pause;
            console.log(JSON.stringify({pause: poause}));
        }
        client.onmessage = (message) => {
            console.log(message);
            let parsedMessage: Message = JSON.parse(message.data.toString());
            if(parsedMessage.type == 'command') {
                executeCommand(parsedMessage);
            }
            else if(parsedMessage.type == 'state') {
                VideoPlayer.receivedState(parsedMessage.state);
            }
        }
        client.onerror = (error) => {
            console.log("error: " + error);
        }
    }

    static sendCommand(command: CommandType, video: VideoType, param: string) {
        client.send(JSON.stringify({type: "command", command: command, video: video, param: param}));
    }

    render() {
        return null
    }
}

function executeCommand(command: Command) {
    if(command.command === CommandType.LoadVideo) {
        VideoPlayer.loadVideo(command.video, command.param);
    } else if(command.command === CommandType.Volume) {
        VideoPlayer.setVolume(command.video, command.param);
    } else if(command.command === CommandType.SeekTo) {
        VideoPlayer.seekTo(command.video, command.param);
    } else if(command.command === CommandType.Pause) {
        VideoPlayer.pause(command.video);
    } else if(command.command === CommandType.Resume) {
        VideoPlayer.resume(command.video);
    }
}

export default Communication;