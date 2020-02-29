import WebSocket from 'ws';

const WSServer = new WebSocket.Server({
    port: 4000
});

export interface Command {
    type: 'command',
    command: string,
    video: 'music' | 'ambience',
    param: string
}

export interface Feedback {
    type: 'feedback',
    message: string
}

export interface StateRequest {
    type: 'stateRequest'
}

export type Message = Command | Feedback | StateRequest

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

WSServer.on('connection', function connection(ws, req) {

    if(req.url === '/geltaradmin') {
        master = ws;
    }

    ws.on('message', function incoming(message) {
        let parsedMessage: Message = JSON.parse(message.toString());
        console.log(parsedMessage);
        if(parsedMessage.type === 'command') {
            updateState(parsedMessage);
            broadcastCommand(parsedMessage);
        } else if(parsedMessage.type === 'feedback') {
            feedbackToMaster(parsedMessage.message, req.connection.remoteAddress);
        } else if(parsedMessage.type === 'stateRequest') {
            stateRequest(ws);
        }
    });

    ws.send("connection OK");
});

function updateState(message: Command) {
    if(message.command === 'loadVideo') {
        state.videos[message.video] = message.param;
    }
}

function broadcastCommand(message: Command) {
    WSServer.clients.forEach(function each(client) {
        if(client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'command', message: message}));
        }
    });
}

function feedbackToMaster(message: string, sender?: string) {
    master?.send(JSON.stringify({ type: 'feedback', message: message, sender: sender }));
}

function stateRequest(sender: WebSocket) {
    sender.send(JSON.stringify(state));
}