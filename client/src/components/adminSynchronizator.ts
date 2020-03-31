import { VideoRole, State, Command, StateMessage } from "../api"
import Communication from "./Communication";

type AdminControls = {
    [key in VideoRole]: {
        volume: HTMLInputElement | undefined,
        seeker: ((time: number) => void) | undefined
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

export const setupSeekerCallback = (role: VideoRole, callback: (time: number) => void) => {
    adminControls[role].seeker = callback;
}

export const updateSeekerSlider = (role: VideoRole, time: number) => {
    adminControls[role].seeker?.(time);
}

const gotCommand = (command: Command) => {
    if (command.command === 'Volume' && adminControls[command.role].volume) {
        adminControls[command.role].volume!.value = command.param;
    } else if (command.command === 'SeekTo') {
        adminControls[command.role].seeker?.(+command.param);
    }
}

const loadState = (state: State) => {
    loadSingleRoleState('music', state);
    loadSingleRoleState('ambience', state);
}

const loadSingleRoleState = (role: VideoRole, state: State) => {
    if (adminControls[role].volume !== undefined) {
        adminControls[role].volume!.value = state[role].masterVolume.toString();
    }
    adminControls[role].seeker?.(state[role].time.elapsed ?? 0);
}

Communication.subscribe('command', (message) => gotCommand(message as Command));
Communication.subscribe('state', (message) => loadState((message as StateMessage).state));
