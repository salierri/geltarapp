export type VideoType = 'music' | 'ambience';

export type CommandType = 'LoadVideo' | 'Volume' | 'SeekTo' | 'Pause' | 'Resume';

export interface Command {
    type: 'command',
    command: CommandType,
    video: VideoType,
    param: string
}

export interface Feedback {
    type: 'feedback',
    message: string,
    sender?: string
}

export interface StateRequest {
    type: 'stateRequest'
}

export interface StateMessage {
    type: 'state',
    state: State
}

export interface Heartbeat {
    type: 'heartbeat'
}

export type Message = Command | Feedback | StateRequest | StateMessage | Heartbeat

export interface VideoState {
    url: string,
    playing: boolean,
    masterVolume: number,
    time: {
        start: number,
        setAt: Date,
        elapsed?: number /* Calculated field to avoid timezone problems */
    }
}

export interface State {
    music: VideoState,
    ambience: VideoState
}
