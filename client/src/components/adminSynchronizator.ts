import { VideoType, State, Command } from "../api"
import { getDuration } from "./videoPlayer";

type AdminControls = {
    [key in VideoType]: {
        volume: HTMLInputElement | undefined,
        seeker: HTMLInputElement | undefined
    }
}
let adminControls: AdminControls = {
    'music': {
        volume: undefined,
        seeker: undefined
    },
    'ambience': {
        volume: undefined,
        seeker: undefined
    }
};

export const setupVolumeSlider = (role: VideoType, slider: HTMLDivElement | null) => {
    adminControls[role].volume = slider as HTMLInputElement;
}

export const setupSeekerSlider = (role: VideoType, slider: HTMLDivElement | null) => {
    adminControls[role].seeker = slider as HTMLInputElement;
}

export const updateSeekerSlider = (role: VideoType, time: number) => {
    if (adminControls[role].seeker) {
        adminControls[role].seeker!.value = (time / getDuration(role) * 100).toString();
    }
}

export const gotCommand = (command: Command) => {
    if (command.command === 'Volume' && adminControls[command.video].volume) {
        adminControls[command.video].volume!.value = command.param;
    } else if (command.command === 'SeekTo' && adminControls[command.video].seeker) {
        adminControls[command.video].seeker!.value = (+command.param / getDuration(command.video) * 100).toString();
    }
}

export const loadState = (state: State) => {
    loadSingleRoleState('music', state);
    loadSingleRoleState('ambience', state);
}

const loadSingleRoleState = (role: VideoType, state: State) => {
    if (adminControls[role].volume !== undefined) {
        adminControls[role].volume!.value = state[role].masterVolume.toString();
    }
    if (adminControls[role].seeker) {
        adminControls[role].seeker!.value = ((state[role].time.elapsed ?? 0) % getDuration(role)).toString();
    }
}
