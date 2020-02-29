import WebSocket from 'ws';

const WSServer = new WebSocket.Server({
    port: 4000
});

export type VideoType = 'music' | 'ambience';
enum CommandType {
    LoadVideo = 'loadVideo',
    Volume = 'volume',
    SeekTo = 'seekTo',
    Pause = 'pause',
    Resume = 'resume'
} 

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

export type Message = Command | Feedback | StateRequest | StateMessage

export interface State {
    videos: {
        music: string,
        ambience: string
    }
}

let master: WebSocket;
let state : State = {
    videos: {
        music: 'm_8QMAChwtg',
        ambience: 'sGkh1W5cbH4'
    }
};

WSServer.on('connection', (ws, req) => {

    if(req.url === '/geltaradmin') {
        master = ws;
    }

    ws.on('message', (message) => {
        let parsedMessage: Message = JSON.parse(message.toString());
        console.log(parsedMessage);
        if(parsedMessage.type === 'command') {
            updateState(parsedMessage);
            broadcastCommand(parsedMessage);
        } else if(parsedMessage.type === 'feedback') {
            feedbackToMaster(parsedMessage.message, req.connection.remoteAddress);
        } else if(parsedMessage.type === 'stateRequest') {
            sendState(ws);
        }
    });

    ws.on('close', (code, reason) => {
        feedbackToMaster("closed", req.connection.remoteAddress);
    });

    sendState(ws);
    feedbackToMaster("connected", req.connection.remoteAddress);
});

function updateState(message: Command) {
    if(message.command === CommandType.LoadVideo) {
        state.videos[message.video] = message.param;
    }
}

function broadcastCommand(message: Command) {
    let countSent = 0;
    WSServer.clients.forEach(function each(client) {
        if(client.readyState === WebSocket.OPEN) {
            countSent++;
            client.send(JSON.stringify(message));
        }
    });
    console.log(countSent);
}

function feedbackToMaster(message: string, sender?: string) {
    master?.send(JSON.stringify({ type: 'feedback', message: message, sender: sender }));
}

function sendState(sender: WebSocket) {
    sender.send(JSON.stringify({type: 'state', state: state}));
}