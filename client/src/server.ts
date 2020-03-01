export declare type VideoType = 'music' | 'ambience';
declare enum CommandType {
    LoadVideo = "loadVideo",
    Volume = "volume",
    SeekTo = "seekTo",
    Pause = "pause",
    Resume = "resume"
}
export interface Command {
    type: 'command';
    command: CommandType;
    video: VideoType;
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
export interface State {
    videos: {
        music: string;
        ambience: string;
    };
}
export {};
