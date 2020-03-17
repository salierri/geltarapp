import WebSocket from 'ws';
import { IncomingMessage } from 'http';
import { State, Message, Command } from './api';

const WSServer = new WebSocket.Server({
    port: 4000
});

let master: WebSocket;
let state: State = {
    videos: {
        music: 'm_8QMAChwtg',
        ambience: 'sGkh1W5cbH4'
    }
};

WSServer.on('connection', (ws, req) => {

    if(req.url?.includes('geltaradmin')) {
        feedbackToMaster("NEW MASTER CLIENT", clientIp(req));
        master = ws;
    }

    ws.on('message', (message) => {
        console.log(clientIp(req) + ": " + message);
        let parsedMessage: Message = JSON.parse(message.toString());
        if(parsedMessage.type === 'command') {
            updateState(parsedMessage);
            broadcastCommand(parsedMessage);
        } else if(parsedMessage.type === 'feedback') {
            feedbackToMaster(parsedMessage.message, clientIp(req));
        } else if(parsedMessage.type === 'stateRequest') {
            sendState(ws);
        } else if(parsedMessage.type === 'heartbeat') {
            sendHeartbeat(ws);
        }
    });

    ws.on('close', (code, reason) => {
        feedbackToMaster("Disconnected", clientIp(req));
    });

    sendState(ws);
    feedbackToMaster("Connected", clientIp(req));
});

function updateState(message: Command) {
    if(message.command === "LoadVideo") {
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
    console.log("Broadcast count: " + countSent);
}

function feedbackToMaster(message: string, sender?: string) {
    master?.send(JSON.stringify({ type: 'feedback', message: message, sender: sender }));
}

function sendState(sender: WebSocket) {
    sender.send(JSON.stringify({type: 'state', state: state}));
}

function sendHeartbeat(sender: WebSocket) {
    sender.send(JSON.stringify({type: 'heartbeat'}));
}

function clientIp(req: IncomingMessage) {
    return (req.headers['x-real-ip'] as string) || req.connection.remoteAddress;
}
