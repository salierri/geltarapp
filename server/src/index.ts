import * as WebSocket from 'ws';

const wss = new WebSocket.Server({
    port: 4000
});

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log(message);
    });

    ws.send("something2");
});
