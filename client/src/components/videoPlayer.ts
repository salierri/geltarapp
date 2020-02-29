import { read, stat } from 'fs';
import { State, VideoType } from '../server';

interface Players {
    music?: YT.Player
    ambience?: YT.Player
}

interface Ready {
    API: boolean,
    state: boolean
}

let players: Players = { };
let autoplay = 1;
let ready = {
    API: false,
    state: false
}
let globalVolumes = {
    music: 100,
    ambience: 100
}
let state: State;

function createPlayer(role: VideoType, video: string) {
    return new YT.Player(role + "Player", {
        height: '243',
        width: '400',
        videoId: video,
        playerVars: {
            controls: 0,
            autoplay: autoplay,
            loop: 1
        },
        events: {
          'onReady': (event) => onPlayerReady(role, event)
        }
    });
}

export function APIReady() {
    ready.API = true;
    checkStart();
}

export function receivedState(newState: State) {
    state = newState;
    ready.state = true;
    checkStart();
}

export function loadVideo(type: VideoType, video: string) {
    players[type]?.loadVideoById(video);
}

export function setVolume(type: VideoType, volume: string) {
    globalVolumes[type] = +volume;
    updateVolume(type);
}

export function pause(type: VideoType) {
    players[type]?.pauseVideo();
}

export function resume(type: VideoType) {
    players[type]?.playVideo();
}

export function seekTo(type: VideoType, percent: string) {
    let seconds: number = (players[type]?.getDuration() ?? 0) * (+percent / 100);
    players[type]?.seekTo(seconds, true);
}

export function localVolume(type: VideoType, percent: number) {
    localStorage.setItem("localvolume_" + type.toString(), percent.toString());
    updateVolume(type);
}

function updateVolume(type: VideoType) {
    let localVolume: number = +(localStorage.getItem("localvolume_" + type.toString()) ?? 100);
    let globalVolume: number = globalVolumes[type];
    players[type]?.setVolume(localVolume * (globalVolume / 100));
}

function checkStart() {
    if(ready.API && ready.state) {
        players.music = createPlayer('music', state.videos.music);
        players.ambience = createPlayer('ambience', state.videos.ambience);
    }
}

function onPlayerReady(role: VideoType, event: YT.PlayerEvent) {
    updateVolume(role);
    event.target.setLoop(true);
}