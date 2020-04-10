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

const state: State = {
  music: defaultVideoSetting('m_8QMAChwtg'),
  ambience: defaultVideoSetting('sGkh1W5cbH4'),
};

export const updateState = (message: Command) => {
  if (message.command === 'LoadVideo') {
    state[message.role].url = message.param;
    state[message.role].playing = true;
  } else if (message.command === 'Volume') {
    state[message.role].masterVolume = +message.param;
  } else if (message.command === 'Pause') {
    state[message.role].playing = false;
  } else if (message.command === 'Resume') {
    state[message.role].playing = true;
  } else if (message.command === 'SeekTo') {
    state[message.role].time = {
      start: +message.param,
      setAt: new Date(),
    };
  }
};

function getElapsedSecondsFrom(time: Date) {
  return (new Date().getTime() - time.getTime()) / 1000;
}

function calculateElapsedTime(role: VideoRole) {
  state[role].time.elapsed = state[role].time.start + getElapsedSecondsFrom(state[role].time.setAt);
}

export const getState = () => {
  calculateElapsedTime('music');
  calculateElapsedTime('ambience');
  return state;
};
