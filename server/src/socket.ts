import WebSocket from 'ws';
import { IncomingMessage } from 'http';
import { v4 as uuidv4 } from 'uuid';
import { Message } from './api';
import * as StateManager from './stateManager';

interface NamedWebSocket extends WebSocket {
  id: string;
  name: string;
  master: boolean;
}

const WSServer = new WebSocket.Server({
  port: +(process.env.WS_PORT ?? 4000),
});

const rooms: { [ key: string ]: NamedWebSocket[]} = {};

export const broadcastMessage = (room: string, message: Message) => {
  let countSent = 0;
  rooms[room].forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      countSent += 1;
      client.send(JSON.stringify(message));
    }
  });
  console.log(`Broadcast count: ${countSent}`);
};
export default broadcastMessage;

function sendToMasters(room: string, message: Message) {
  rooms[room].forEach((socket) => {
    if (!socket.master) {
      return;
    }
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  });
}

function broadcastNames(room: string) {
  const users: { [key: string]: string } = {};
  for (const client of rooms[room]) {
    users[client.id] = client.name;
  }
  broadcastMessage(room, { type: 'users', users });
}

function setName(room: string, name: string, sender: NamedWebSocket) {
  sender.name = name;
  broadcastNames(room);
}

function sendState(sender: WebSocket) {
  sender.send(JSON.stringify({ type: 'state', state: StateManager.getState() }));
}

function sendHeartbeat(sender: WebSocket) {
  sender.send(JSON.stringify({ type: 'heartbeat' }));
}

function removeFromSockets(room: string, socket: NamedWebSocket) {
  const index = rooms[room].indexOf(socket);
  if (index > -1) {
    rooms[room].splice(index, 1);
  }
  broadcastNames(room);
}

function clientIp(req: IncomingMessage) {
  return (req.headers['x-real-ip'] as string) || req.connection.remoteAddress;
}

function addToSockets(room: string, socket: NamedWebSocket) {
  if (!(room in rooms)) {
    rooms[room] = [];
  }
  rooms[room].push(socket);
}

WSServer.on('connection', (ws: NamedWebSocket, req) => {
  ws.id = uuidv4();
  const roomId: string = req.url?.replace('/', '').replace('/geltaradmin', '') ?? '';
  ws.master = req.url?.includes('geltaradmin') ?? false;
  addToSockets(roomId, ws);

  ws.on('message', (message) => {
    console.log(`${clientIp(req)}: ${message}`);
    const parsedMessage: Message = JSON.parse(message.toString());
    if (parsedMessage.type === 'command') {
      StateManager.updateState(parsedMessage);
      broadcastMessage(roomId, parsedMessage);
    } else if (parsedMessage.type === 'feedback') {
      parsedMessage.sender = ws.id;
      broadcastMessage(roomId, parsedMessage);
    } else if (parsedMessage.type === 'stateRequest') {
      sendState(ws);
    } else if (parsedMessage.type === 'heartbeat') {
      sendHeartbeat(ws);
    } else if (parsedMessage.type === 'setName') {
      setName(roomId, parsedMessage.name, ws);
    } else if (parsedMessage.type === 'suggestion') {
      parsedMessage.sender = ws.id;
      sendToMasters(roomId, parsedMessage);
    }
  });

  ws.on('close', () => {
    removeFromSockets(roomId, ws);
  });

  sendState(ws);
});
