import { VideoRole, State, Command } from "../api"
import { getDuration } from "./videoPlayer";

type AdminControls = {
    [key in VideoRole]: {
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

export const setupVolumeSlider = (role: VideoRole, slider: HTMLDivElement | null) => {
    adminControls[role].volume = slider as HTMLInputElement;
}

export const setupSeekerSlider = (role: VideoRole, slider: HTMLDivElement | null) => {
    adminControls[role].seeker = slider as HTMLInputElement;
}

export const updateSeekerSlider = (role: VideoRole, time: number) => {
    if (adminControls[role].seeker) {
        adminControls[role].seeker!.value = (time / getDuration(role) * 100).toString();
    }
}

export const gotCommand = (command: Command) => {
    if (command.command === 'Volume' && adminControls[command.role].volume) {
        adminControls[command.role].volume!.value = command.param;
    } else if (command.command === 'SeekTo' && adminControls[command.role].seeker) {
        adminControls[command.role].seeker!.value = (+command.param / getDuration(command.role) * 100).toString();
    }
}

export const loadState = (state: State) => {
    loadSingleRoleState('music', state);
    loadSingleRoleState('ambience', state);
}

const loadSingleRoleState = (role: VideoRole, state: State) => {
    if (adminControls[role].volume !== undefined) {
        adminControls[role].volume!.value = state[role].masterVolume.toString();
    }
    if (adminControls[role].seeker) {
        adminControls[role].seeker!.value = ((state[role].time.elapsed ?? 0) % getDuration(role)).toString();
    }
}
