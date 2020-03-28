export declare type VideoRole = 'music' | 'ambience';
export declare type CommandType = 'LoadVideo' | 'Volume' | 'SeekTo' | 'Pause' | 'Resume' | 'LoadMp3';
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
export declare type Message = Command | Feedback | StateRequest | StateMessage | Heartbeat;
export interface VideoState {
    url: string;
    playing: boolean;
    masterVolume: number;
    time: {
        start: number;
        setAt: Date;
        elapsed?: number;
    };
}
export interface State {
    music: VideoState;
    ambience: VideoState;
}
