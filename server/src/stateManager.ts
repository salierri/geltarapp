import { State, Command, VideoRole } from './api';

function defaultVideoSetting(url: string) {
  return {
    url,
    masterVolume: 100,
    playing: true,
    time: {
      setAt: new Date(),
      start: 0,
    },
  };
}

const state: { [key: string]: State } = { };

export const updateState = (room: string, message: Command) => {
  if (message.command === 'LoadVideo') {
    state[room][message.role].url = message.param;
    state[room][message.role].playing = true;
  } else if (message.command === 'Volume') {
    state[room][message.role].masterVolume = +message.param;
  } else if (message.command === 'Pause') {
    state[room][message.role].playing = false;
  } else if (message.command === 'Resume') {
    state[room][message.role].playing = true;
  } else if (message.command === 'SeekTo') {
    state[room][message.role].time = {
      start: +message.param,
      setAt: new Date(),
    };
  }
};

function getElapsedSecondsFrom(time: Date) {
  return (new Date().getTime() - time.getTime()) / 1000;
}

function calculateElapsedTime(room: string, role: VideoRole) {
  state[room][role].time.elapsed = state[room][role].time.start
    + getElapsedSecondsFrom(state[room][role].time.setAt);
}

function setDefault(room: string) {
  state[room] = {
    music: defaultVideoSetting('m_8QMAChwtg'),
    ambience: defaultVideoSetting('sGkh1W5cbH4'),
  };
}

export const getState = (room: string) => {
  if (!(room in state)) {
    setDefault(room);
  }
  calculateElapsedTime(room, 'music');
  calculateElapsedTime(room, 'ambience');
  return state[room];
};
