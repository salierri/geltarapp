import { w3cwebsocket as WebSocket } from 'websocket';
import React from 'react';
import { Message, CommandType, VideoRole } from '../api';
import * as Helpers from '../helpers/Helpers';

const address = Helpers.isAdmin() ? `${process.env.REACT_APP_URL}/geltaradmin` : process.env.REACT_APP_URL ?? '';
let client: WebSocket;

interface MessageState {
  messages: Array<string>;
}

let subscriptions: { [key in Message['type']]?: ((message: Message) => void)[] };

class Communication extends React.Component<{}, MessageState> {
  static sendCommand(command: CommandType, role: VideoRole, param: string) {
    Communication.send({
      type: 'command',
      command,
      role,
      param,
    });
  }

  static sendFeedback(message: string) {
    Communication.send({ type: 'feedback', message });
  }

  static heartbeat() {
    Communication.send({ type: 'heartbeat' });
  }

  private static send(message: Message) {
    if (client.readyState === 1 /* Ready */) {
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


  lastLogEvent: React.RefObject<HTMLDivElement>;

  constructor(props: {}) {
    super(props);

    this.state = {
      messages: [],
    };
    this.lastLogEvent = React.createRef();
  }

  componentDidMount() {
    this.connect();
    setInterval(Communication.heartbeat, 3000);
  }

  componentDidUpdate() {
        this.lastLogEvent.current?.scrollIntoView({ behavior: 'smooth' });
  }

  connect() {
    client = new WebSocket(address);
    client.onopen = () => {
      this.log('Connected to Socket');
    };
    client.onmessage = (message) => {
      console.log(message);
      const parsedMessage: Message = JSON.parse(message.data.toString());
      if (subscriptions[parsedMessage.type]) {
        subscriptions[parsedMessage.type]?.forEach((callback) => {
          callback(parsedMessage);
        });
      }
      if (parsedMessage.type === 'feedback') {
        this.log(`${parsedMessage.sender} - ${parsedMessage.message}`);
      }
    };
    client.onerror = (error) => {
      console.log(`error: ${error}`);
      client.close();
    };
    client.onclose = () => {
      setTimeout(() => {
        this.connect();
      }, 1000);
    };
  }

  log(message: string) {
    this.state.messages.push(`${(new Date()).toLocaleTimeString()} - ${message}`);
    this.forceUpdate();
  }

  render() {
    if (!Helpers.isAdmin()) {
      return null;
    }
    return (
      <div id="log-area">
        {this.state.messages.map((message) => <p className="log-message">{ message }</p>)}
        <div ref={this.lastLogEvent} />
      </div>
    );
  }
}

export default Communication;
