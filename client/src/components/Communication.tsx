import React from 'react';
import { w3cwebsocket as WebSocket } from 'websocket';
import { CommandType, Message, VideoRole } from '../api';
import * as Helpers from '../helpers/Helpers';

let client: WebSocket;

interface CommunicationParams {
  room: string;
}

let subscriptions: { [key in Message['type']]?: ((message: Message) => void)[] };

class Communication extends React.Component<CommunicationParams, {}> {
  static sendCommand(command: CommandType, role: VideoRole, param: string) {
    Communication.send({
      type: 'command',
      command,
      role,
      param,
    });
  }

  static nameUpdate(name: string) {
    Communication.send({
      type: 'setName',
      name,
    });
  }

  static sendFeedback(message: string) {
    Communication.send({ type: 'feedback', message });
  }

  static heartbeat() {
    Communication.send({ type: 'heartbeat' });
  }

  static send(message: Message) {
    if (client && client.readyState === 1 /* Ready */) {
      client.send(JSON.stringify(message));
    }
  }

  static subscribe(type: Message['type'], callback: (message: Message) => void) {
    if (!subscriptions) {
      subscriptions = {};
    }
    if (!subscriptions[type]) {
      subscriptions[type] = [];
    }
    subscriptions[type]?.push(callback);
  }

  async componentDidMount() {
    const roomId = this.props.room;
    this.connect(roomId, Helpers.isAdmin());
    
    setInterval(Communication.heartbeat, 3000);
  }

  connect(room: string, admin: boolean) {
    if (localStorage.getItem("session") !== null) {
      document.cookie = 'X-Auth-Token=' + localStorage.getItem("session") + '; path=/';
    }
    const address = `${process.env.REACT_APP_WS_URL}/${room}${admin ? '/geltaradmin' : ''}`;
    client = new WebSocket(address);
    client.onopen = () => {
      console.log('Connected to Socket');
    };
    client.onmessage = (message) => {
      const parsedMessage: Message = JSON.parse(message.data.toString());
      if (parsedMessage.type !== 'heartbeat') {
        console.log(message);
      }
      if (subscriptions[parsedMessage.type]) {
        subscriptions[parsedMessage.type]?.forEach((callback) => {
          callback(parsedMessage);
        });
      }
    };
    client.onerror = (error) => {
      console.log(`error: ${error}`);
      client.close();
    };
    client.onclose = () => {
      setTimeout(() => {
        this.connect(room, admin);
      }, 1000);
    };
  }

  render() {
    return null;
  }
}

export default Communication;
