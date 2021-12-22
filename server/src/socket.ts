import WebSocket from 'ws';
import { IncomingMessage } from 'http';
import { v4 as uuidv4 } from 'uuid';
import { Message } from './api';
import * as StateManager from './stateManager';
import { Room } from './models/Room';
import { Session } from './models/Session';
import { Request} from 'express';
import mongoose from 'mongoose';
import cookie from 'cookie';

interface NamedWebSocket extends WebSocket {
  id: string;
  name: string;
  master: boolean;
}

const WSServer = new WebSocket.Server({
  port: +(process.env.WS_PORT ?? 4000),
});

const rooms: { [ key: string ]: NamedWebSocket[] } = {};

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

export const getConnectionCount = () => Object.values(rooms).reduce<number>((t, room) => t + room.length, 0);
export const getActiveRooms = () => Object.values(rooms).reduce<number>((t, room) => t + room.length > 0 ? 1 : 0, 0);

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

function sendState(room: string, sender: WebSocket) {
  sender.send(JSON.stringify({ type: 'state', state: StateManager.getState(room) }));
}

function sendHeartbeat(sender: WebSocket) {
  sender.send(JSON.stringify({ type: 'heartbeat' }));
}

function terminateWithError(socket: WebSocket, error: string) {
  socket.send(JSON.stringify({ type: 'error', error }));
  socket.terminate();
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
  const roomId: string = req.url?.replace('/', '') ?? '';
  const sessionId = cookie.parse(req.headers.cookie ?? '')['X-Auth-Token'];
  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    terminateWithError(ws, 'invalid session');
    return;
  }
  Session.findOne({ _id: sessionId })
  .then((session) => {
    if (session === null) {
      terminateWithError(ws, 'unauthorized');
      return;
    }
    ws.master = session.master;
    ws.id = uuidv4();
    addToSockets(roomId, ws);
  
    ws.on('message', (message) => {
      const parsedMessage: Message = JSON.parse(message.toString());
      if (parsedMessage.type !== 'heartbeat') {
        console.log(`${clientIp(req)}: ${message}`);
      }
      if (parsedMessage.type === 'command') {
        StateManager.updateState(roomId, parsedMessage);
        broadcastMessage(roomId, parsedMessage);
      } else if (parsedMessage.type === 'feedback') {
        parsedMessage.sender = ws.id;
        broadcastMessage(roomId, parsedMessage);
      } else if (parsedMessage.type === 'stateRequest') {
        sendState(roomId, ws);
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
  
    sendState(roomId, ws);
  });
});
