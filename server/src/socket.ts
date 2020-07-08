import WebSocket from 'ws';
import { IncomingMessage } from 'http';
import { Message } from './api';
import * as StateManager from './stateManager';
import { v4 as uuidv4 } from 'uuid';

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

function feedbackToMaster(message: string, sender?: string) {
  masters.forEach((master) => {
    if (master.readyState === WebSocket.OPEN) {
      master.send(JSON.stringify({ type: 'feedback', message, sender }));
    }
  });
}

function broadcastNames() {
  let names: string[] = [];
  for(let client of sockets) {
    names.push(client.name);
  }
  broadcastMessage({ type: 'users', names });
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
  if(index > -1) {
    sockets.splice(index, 1);
  }
  broadcastNames();
}

function clientIp(req: IncomingMessage) {
  return (req.headers['x-real-ip'] as string) || req.connection.remoteAddress;
}

WSServer.on('connection', (ws: NamedWebSocket, req) => {
  if (req.url?.includes('geltaradmin')) {
    feedbackToMaster('NEW MASTER CLIENT', clientIp(req));
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
      parsedMessage.sender = clientIp(req);
      broadcastMessage(parsedMessage);
    } else if (parsedMessage.type === 'stateRequest') {
      sendState(ws);
    } else if (parsedMessage.type === 'heartbeat') {
      sendHeartbeat(ws);
    } else if (parsedMessage.type === 'setName') {
      setName(parsedMessage.name, ws);
    }
  });

  ws.on('close', () => {
    removeFromSockets(ws);
    feedbackToMaster('Disconnected', clientIp(req));
  });

  sendState(ws);
  feedbackToMaster('Connected', clientIp(req));
});
