export type VideoRole = 'music' | 'ambience';

export type CommandType = 'LoadVideo' | 'Volume' | 'SeekTo' | 'Pause' | 'Resume' | 'LoadMp3';

export interface Command {
    type: 'command';
    command: CommandType;
    role: VideoRole;
    param: string;
}

export interface Feedback {
    type: 'feedback';
    message: string;
    sender?: string;
}

export interface StateRequest {
    type: 'stateRequest';
}

export interface StateMessage {
    type: 'state';
    state: State;
}

export interface Heartbeat {
    type: 'heartbeat';
}

export interface NameSetting {
    type: 'setName';
    name: string;
}

export interface UserBroadcast {
    type: 'users';
    users: { [key: string]: string };
}

export interface Suggestion {
    type: 'suggestion';
    video: string;
    sender?: string;
}

export type Message = Command | Feedback | StateRequest | StateMessage | Heartbeat
                    | NameSetting | UserBroadcast | Suggestion

export interface VideoState {
    url: string;
    playing: boolean;
    masterVolume: number;
    time: {
        start: number;
        setAt: Date;
        elapsed?: number; /* Calculated field to avoid timezone problems */
    };
}

export interface State {
    music: VideoState;
    ambience: VideoState;
}

export interface Category {
    _id: string;
    name: string;
    role: VideoRole;
}

export interface Preset {
    _id: string;
    name: string;
    url: string;
    title: string;
    length: number;
    category: Category;
}

export interface Room {
    _id: string;
    name: string;
    password: string;
    type: 'public' | 'password' | 'private';
}
