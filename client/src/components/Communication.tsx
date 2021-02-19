import React from 'react';
import { w3cwebsocket as WebSocket } from 'websocket';
import { CommandType, Message, VideoRole } from '../api';
import * as Persistence from '../helpers/Persistence';

let client: WebSocket;

interface CommunicationParams {
  room: string;
}

let subscriptions: { [key in Message['type']]?: ((message: Message) => void)[] };

class Communication extends React.Component<CommunicationParams, {}> {
  exiting: boolean = false;   // To avoid accidental reconnects after desired exit
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
    this.connect(roomId);
    
    setInterval(Communication.heartbeat, 3000);
  }

  componentWillUnmount() {
    this.exiting = true;
    client.close();
  }

  connect(room: string) {
    if (Persistence.savedSessionExists()) {
      document.cookie = `X-Auth-Token=${Persistence.getSession().sessionId}; path=/`;
    }
    const address = `${process.env.REACT_APP_WS_URL}/${room}`;
    client = new WebSocket(address);
    client.onopen = () => {
      console.log('Connected to Socket');
    };
    client.onmessage = (message) => {
      const parsedMessage: Message = JSON.parse(message.data.toString());
      if (parsedMessage.type !== 'heartbeat') {
        console.log(message);
      }
      if (parsedMessage.type === 'error') {
        Persistence.forgetSession();
        localStorage.removeItem('session');
        localStorage.removeItem('roomId');
        window.location.href = '/';
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
      if (!this.exiting) {
        setTimeout(() => {
          this.connect(room);
        }, 1000);
      }
    };
  }

  render() {
    return null;
  }
}

export default Communication;
