import { start } from 'repl';
import { State, VideoRole, Command, StateMessage } from '../api';
import Communication from './Communication';

type Players = {
  [key in VideoRole]?: YT.Player
};
type LoadedCallbacks = {
  [key in VideoRole]?: (time: number) => void;
};

const players: Players = { };
const ready = {
  API: false,
  state: false,
};
let state: State;
const durations = {
  music: 1,
  ambience: 1,
};
const loadedCallbacks: LoadedCallbacks = {};

function loadVideo(role: VideoRole, video: string) {
  state[role].playing = true;
  players[role]?.loadVideoById(video);
}

function updateVolume(role: VideoRole) {
  const localVolume: number = +(localStorage.getItem(`localvolume_${role.toString()}`) ?? 100);
  const globalVolume: number = state[role].masterVolume;
  players[role]?.setVolume(localVolume * (globalVolume / 100));
}

function setMasterVolume(role: VideoRole, volume: string) {
  state[role].masterVolume = +volume;
  updateVolume(role);
}

function pause(role: VideoRole) {
  state[role].playing = false;
  players[role]?.pauseVideo();
}

function resume(role: VideoRole) {
  state[role].playing = true;
  players[role]?.playVideo();
}

function seekTo(role: VideoRole, seconds: string) {
  players[role]?.seekTo(+seconds, true);
}

export function setLocalVolume(role: VideoRole, percent: number) {
  localStorage.setItem(`localvolume_${role.toString()}`, percent.toString());
  updateVolume(role);
}

export function getDuration(role: VideoRole) {
  return durations[role];
}

export const getMasterVolume = (role: VideoRole) => state?.[role].masterVolume ?? 100;

function setPosition(role: VideoRole) {
  const duration = players[role]?.getDuration() ?? 1;
  const position = (state[role].time.elapsed ?? 0) % duration;
  players[role]?.seekTo(position, true);
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
  } else if (event.data === YT.PlayerState.PLAYING) {
    durations[role] = event.target.getDuration();
    loadedCallbacks[role]?.(event.target.getCurrentTime());
    if (!state[role].playing) { // After seekAhead, the video autoplays, while it sometimes shouldn't
      players[role]?.pauseVideo();
    }
  }
}

function createPlayer(role: VideoRole, video: string, autoplay: boolean) {
  return new YT.Player(`${role}Player`, {
    height: '225',
    width: '400',
    host: 'https://www.youtube-nocookie.com',
    videoId: video,
    playerVars: {
      controls: 0,
      autoplay: autoplay ? 1 : 0,
    },
    events: {
      onReady: (event) => onPlayerReady(role, event),
      onStateChange: (event) => onPlayerStateChange(role, event),
    },
  });
}

function instantiatePlayers() {
  players.music = createPlayer('music', state.music.url, state.music.playing);
  players.ambience = createPlayer('ambience', state.ambience.url, state.ambience.playing);
}

export function APIReady() {
  ready.API = true;
  if (ready.state && players.music === undefined) {
    instantiatePlayers();
  }
}

function receivedState(newState: State) {
  state = newState;

  ready.state = true;
  if (ready.API) {
    instantiatePlayers();
  }
}

export const subscribeVideoLoaded = (role: VideoRole, callback: (time: number) => void) => {
  loadedCallbacks[role] = callback;
};

export const executeCommand = (command: Command) => {
  if (command.command === 'LoadVideo') {
    loadVideo(command.role, command.param);
  } else if (command.command === 'Volume') {
    setMasterVolume(command.role, command.param);
  } else if (command.command === 'SeekTo') {
    seekTo(command.role, command.param);
  } else if (command.command === 'Pause') {
    pause(command.role);
  } else if (command.command === 'Resume') {
    resume(command.role);
  }
};

Communication.subscribe('command', (command) => executeCommand(command as Command));
Communication.subscribe('state', (message) => receivedState((message as StateMessage).state));
