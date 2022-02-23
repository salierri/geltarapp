import React from 'react';
import FloatingEmoji from './FloatingEmoji';
import Communication from './Communication';
import { Feedback, UserBroadcast } from '../api';

class EmojiContainer extends React.Component {
  emojis: JSX.Element[];
  users: { [key: string]: string } = {};

  constructor(props: {}) {
    super(props);
    this.emojis = [];
  }

  newEmoji = (message: Feedback) => {
    const key = Math.random();
    let yPosition = 90;
    Object.keys(this.users).some((userId) => {
      if (userId === message.sender) {
        return true;
      }
      yPosition += 180;
      return false;
    });
    if (message.message === 'like') {
      this.emojis.push(<FloatingEmoji removeCallback={this.removeEmoji} key={key} yPosition={yPosition} label="thumbs-up" emoji="👍" />);
    } else if (message.message === 'boring') {
      this.emojis.push(<FloatingEmoji removeCallback={this.removeEmoji} key={key} yPosition={yPosition} label="sleeping" emoji="😴" />);
    }
    this.forceUpdate();
  };

  removeEmoji = () => {
    this.emojis.shift();
    this.forceUpdate();
  };

  componentDidMount = () => {
    Communication.subscribe('feedback', (feedback) => this.newEmoji((feedback as Feedback)));
    Communication.subscribe('users', (userList) => { this.users = (userList as UserBroadcast).users; });
  };

  render() {
    return (
      <div>
        { this.emojis }
      </div>
    );
  }
}

export default EmojiContainer;
