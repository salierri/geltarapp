import WebSocket from 'ws';
import { IncomingMessage } from 'http';
import { v4 as uuidv4 } from 'uuid';
import { Message } from './api';
import * as StateManager from './stateManager';

interface NamedWebSocket extends WebSocket {
  id: string;
  name: string;
}

const WSServer = new WebSocket.Server({
  port: +(process.env.WS_PORT ?? 4000),
});

const masters: WebSocket[] = [];
const sockets: NamedWebSocket[] = [];

export const broadcastMessage = (message: Message) => {
  let countSent = 0;
  WSServer.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      countSent += 1;
      client.send(JSON.stringify(message));
    }
  });
  console.log(`Broadcast count: ${countSent}`);
};
export default broadcastMessage;

function sendToMasters(message: Message) {
  masters.forEach((master) => {
    if (master.readyState === WebSocket.OPEN) {
      master.send(JSON.stringify(message));
    }
  });
}

function broadcastNames() {
  const users: { [key: string]: string } = {};
  for (const client of sockets) {
    users[client.id] = client.name;
  }
  broadcastMessage({ type: 'users', users });
}

function setName(name: string, sender: NamedWebSocket) {
  sender.name = name;
  broadcastNames();
}

function sendState(sender: WebSocket) {
  sender.send(JSON.stringify({ type: 'state', state: StateManager.getState() }));
}

function sendHeartbeat(sender: WebSocket) {
  sender.send(JSON.stringify({ type: 'heartbeat' }));
}

function removeFromSockets(socket: NamedWebSocket) {
  const index = sockets.indexOf(socket);
  if (index > -1) {
    sockets.splice(index, 1);
  }
  broadcastNames();
}

function clientIp(req: IncomingMessage) {
  return (req.headers['x-real-ip'] as string) || req.connection.remoteAddress;
}

WSServer.on('connection', (ws: NamedWebSocket, req) => {
  if (req.url?.includes('geltaradmin')) {
    masters.push(ws);
  }

  ws.id = uuidv4();
  sockets.push(ws);

  ws.on('message', (message) => {
    console.log(`${clientIp(req)}: ${message}`);
    const parsedMessage: Message = JSON.parse(message.toString());
    if (parsedMessage.type === 'command') {
      StateManager.updateState(parsedMessage);
      broadcastMessage(parsedMessage);
    } else if (parsedMessage.type === 'feedback') {
      parsedMessage.sender = ws.id;
      broadcastMessage(parsedMessage);
    } else if (parsedMessage.type === 'stateRequest') {
      sendState(ws);
    } else if (parsedMessage.type === 'heartbeat') {
      sendHeartbeat(ws);
    } else if (parsedMessage.type === 'setName') {
      setName(parsedMessage.name, ws);
    } else if (parsedMessage.type === 'suggestion') {
      parsedMessage.sender = ws.id;
      sendToMasters(parsedMessage);
    }
  });

  ws.on('close', () => {
    removeFromSockets(ws);
  });

  sendState(ws);
});
