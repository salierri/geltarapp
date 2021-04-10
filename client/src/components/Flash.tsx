import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import 'typeface-roboto';
import '../style/App.css';

interface FlashState {
  snackbarOpen: boolean;
  message: string;
}

export default class Flash extends React.Component<RouteComponentProps, FlashState> {
  unlisten?: () => void;

  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      snackbarOpen: false,
      message: "",
    };
  }

  niceMessage = (message: string) => {
    switch (message) {
      case "incorrectpass":
        return "Incorrect password!"
      case "disablepopupblocker":
        return "Something is blocking video loading. Please disable your Popup Blocker or similar extensions."
      default:
        return "Something bad happened!";
    }
  }

  getFlash = () => {
    const message = (new URLSearchParams(window.location.search)).get("message");
    this.setState({
      snackbarOpen: message !== null,
      message: this.niceMessage(message ?? ""),
    });
  }

  componentDidMount() {
    this.unlisten = this.props.history.listen((location, action) => { this.getFlash(); });
    this.getFlash();
  }

  componentWillUnmount() {
    this.unlisten?.();
  }

  render() {
    return (
    <Snackbar open={this.state.snackbarOpen} onClose={() => this.setState({ snackbarOpen: false })}>
      <Alert onClose={() => this.setState({ snackbarOpen: false })} severity="error">
        {this.state.message}
      </Alert>
    </Snackbar>
    );
  }
}
