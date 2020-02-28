import { Component } from 'react';
import { w3cwebsocket as WebSocket } from "websocket";

const client = new WebSocket('wss://echo.websocket.org');

class Communication extends Component {
    componentDidMount() {
        client.onopen = () => {
            console.log("client connected");
        }
        client.onerror = (error) => {
            console.log("error: " + error);
        }
    }

    render() {
        return null
    }
}

export default Communication;