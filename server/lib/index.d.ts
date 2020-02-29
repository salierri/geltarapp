export interface Command {
    type: 'command';
    command: string;
    video: 'music' | 'ambience';
    param: string;
}
export interface Feedback {
    type: 'feedback';
    message: string;
}
export interface StateRequest {
    type: 'stateRequest';
}
export declare type Message = Command | Feedback | StateRequest;
export interface State {
    videos: {
        music: string;
        ambience: string;
    };
}
