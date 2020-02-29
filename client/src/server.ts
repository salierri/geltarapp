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
}
export interface StateRequest {
    type: 'stateRequest';
}
export interface StateMessage {
    type: 'state';
    state: State;
}
export declare type Message = Command | Feedback | StateRequest | StateMessage;
export interface State {
    videos: {
        music: string;
        ambience: string;
    };
}
export {};
