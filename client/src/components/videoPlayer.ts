import { State, VideoType } from '../api';
import { updateSeekerSlider } from './adminSynchronizator';

interface Players {
    music?: YT.Player
    ambience?: YT.Player
}

let players: Players = { };
let ready = {
    API: false,
    state: false
}
let state: State;
let durations = {
    'music': 1,
    'ambience': 1
}

function createPlayer(role: VideoType, video: string, autoplay: boolean) {
    return new YT.Player(role + "Player", {
        height: '243',
        width: '400',
        videoId: video,
        playerVars: {
            controls: 0,
            autoplay: autoplay ? 1 : 0
        },
        events: {
          'onReady': (event) => onPlayerReady(role, event),
          'onStateChange': (event) => onPlayerStateChange(role, event)
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

export function setMasterVolume(type: VideoType, volume: string) {
    state[type].masterVolume = +volume;
    updateVolume(type);
}

export function pause(type: VideoType) {
    players[type]?.pauseVideo();
}

export function resume(type: VideoType) {
    players[type]?.playVideo();
}

export function seekTo(type: VideoType, seconds: string) {
    players[type]?.seekTo(+seconds, true);
}

export function localVolume(type: VideoType, percent: number) {
    localStorage.setItem("localvolume_" + type.toString(), percent.toString());
    updateVolume(type);
}

export function getDuration(type: VideoType) {
    return durations[type];
}

export const getMasterVolume = (type: VideoType) => {
    return state?.[type].masterVolume ?? 100;
}

export const getVideoPosition = (type: VideoType) => {
    return state?.[type].time.elapsed ?? 0;
}

function updateVolume(type: VideoType) {
    let localVolume: number = +(localStorage.getItem("localvolume_" + type.toString()) ?? 100);
    let globalVolume: number = state[type].masterVolume;
    players[type]?.setVolume(localVolume * (globalVolume / 100));
}

function setPosition(type: VideoType) {
    let duration = players[type]?.getDuration() ?? 1;
    let position = (state[type].time.elapsed ?? 0) % duration;
    players[type]?.seekTo(position, true);
}

function checkStart() {
    if (ready.API && ready.state) {
        players.music = createPlayer('music', state.music.url, state.music.playing);
        players.ambience = createPlayer('ambience', state.ambience.url, state.ambience.playing);
    }
}

function onPlayerReady(role: VideoType, event: YT.PlayerEvent) {
    updateVolume(role);
    setPosition(role);
    event.target.setLoop(true);
}

function onPlayerStateChange(role: VideoType, event: YT.OnStateChangeEvent) {
    if (event.data === YT.PlayerState.ENDED) {
        event.target.seekTo(0, true);
        event.target.playVideo();
    }
    else if (event.data === YT.PlayerState.PLAYING) {
        durations[role] = event.target.getDuration();
        updateSeekerSlider(role, event.target.getCurrentTime());
    }
}
