import { State, VideoState, Command, VideoType } from "./api";

let state: State = {
    music: defaultVideoSetting('m_8QMAChwtg'),
    ambience: defaultVideoSetting('sGkh1W5cbH4')
};

export const updateState = (message: Command) => {
    if(message.command === "LoadVideo") {
        state[message.video].url = message.param;
        state[message.video].playing = true;
    } else if(message.command === "Volume") {
        state[message.video].masterVolume = +message.param;
    } else if(message.command === "Pause") {
        state[message.video].playing = false;
    } else if(message.command === "Resume") {
        state[message.video].playing = true;
    } else if(message.command === "SeekTo") {
        state[message.video].time = {
            start: +message.param,
            setAt: new Date()
        }
    }
}

export const getState = () => {
    calculateElapsedTime('music');
    calculateElapsedTime('ambience');
    return state;
}

function calculateElapsedTime(type: VideoType) {
    state[type].time.elapsed = state[type].time.start + getElapsedSecondsFrom(state[type].time.setAt);
}

function getElapsedSecondsFrom(time: Date) {
    return (new Date().getTime() - time.getTime()) / 1000;
}

function defaultVideoSetting(url: string) {
    return {
        url: url,
        masterVolume: 100,
        playing: true,
        time: {
            setAt: new Date(),
            start: 0
        }
    }
}
