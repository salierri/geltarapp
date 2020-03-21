import React from 'react';
import FloatingEmoji from './FloatingEmoji';
import Communication from './Communication';
import { Feedback } from '../api';

class EmojiContainer extends React.Component {

    emojis: JSX.Element[];

    constructor(props: {}) {
        super(props);
        this.emojis = [];
    }

    newEmoji = (message: string) => {
        let key = Math.random();
        if(message === "like") {
            this.emojis.push(<FloatingEmoji parent={this} key={key} label="thumbs-up" emoji="👍" />);
        } else if(message === "boring") {
            this.emojis.push(<FloatingEmoji parent={this} key={key} label="sleeping" emoji="😴" />);
        }
        this.forceUpdate();
    }

    removeEmoji = () => {
        this.emojis.shift();
        this.forceUpdate();
    }

    componentDidMount = () => {
        Communication.subscribe('feedback', (feedback) => this.newEmoji((feedback as Feedback).message));
    }

    render() {
        return (
            <div>
                { this.emojis }
            </div>
        );
    }
}

export default EmojiContainer;
