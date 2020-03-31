import { State, VideoRole, Command, StateMessage } from '../api';
import { updateSeekerSlider } from './adminSynchronizator';
import Communication from './Communication';

type Players = {
    [key in VideoRole]?: YT.Player
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

function createPlayer(role: VideoRole, video: string, autoplay: boolean) {
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

function receivedState(newState: State) {
    state = newState;

    ready.state = true;
    checkStart();
}

function loadVideo(role: VideoRole, video: string) {
    players[role]?.loadVideoById(video);
}

function setMasterVolume(role: VideoRole, volume: string) {
    state[role].masterVolume = +volume;
    updateVolume(role);
}

function pause(role: VideoRole) {
    players[role]?.pauseVideo();
}

function resume(role: VideoRole) {
    players[role]?.playVideo();
}

function seekTo(role: VideoRole, seconds: string) {
    players[role]?.seekTo(+seconds, true);
}

export function localVolume(role: VideoRole, percent: number) {
    localStorage.setItem("localvolume_" + role.toString(), percent.toString());
    updateVolume(role);
}

export function getDuration(role: VideoRole) {
    return durations[role];
}

export const getMasterVolume = (role: VideoRole) => {
    return state?.[role].masterVolume ?? 100;
}

function updateVolume(role: VideoRole) {
    let localVolume: number = +(localStorage.getItem("localvolume_" + role.toString()) ?? 100);
    let globalVolume: number = state[role].masterVolume;
    players[role]?.setVolume(localVolume * (globalVolume / 100));
}

function setPosition(role: VideoRole) {
    let duration = players[role]?.getDuration() ?? 1;
    let position = (state[role].time.elapsed ?? 0) % duration;
    players[role]?.seekTo(position, true);
}

function checkStart() {
    if (ready.API && ready.state) {
        players.music = createPlayer('music', state.music.url, state.music.playing);
        players.ambience = createPlayer('ambience', state.ambience.url, state.ambience.playing);
    }
}

function onPlayerReady(role: VideoRole, event: YT.PlayerEvent) {
    updateVolume(role);
    setPosition(role);
    event.target.setLoop(true);
}

function onPlayerStateChange(role: VideoRole, event: YT.OnStateChangeEvent) {
    if (event.data === YT.PlayerState.ENDED) {
        event.target.seekTo(0, true);
        event.target.playVideo();
    }
    else if (event.data === YT.PlayerState.PLAYING) {
        durations[role] = event.target.getDuration();
        updateSeekerSlider(role, event.target.getCurrentTime());
    }
}

export const executeCommand = (command: Command) => {
    if(command.command === "LoadVideo") {
        loadVideo(command.role, command.param);
    } else if(command.command === "Volume") {
        setMasterVolume(command.role, command.param);
    } else if(command.command === "SeekTo") {
        seekTo(command.role, command.param);
    } else if(command.command === "Pause") {
        pause(command.role);
    } else if(command.command === "Resume") {
        resume(command.role);
    }
}

Communication.subscribe('command', (command) => executeCommand(command as Command));
Communication.subscribe('state', (state) => receivedState((state as StateMessage).state));
