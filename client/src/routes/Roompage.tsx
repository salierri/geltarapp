import { Box, Button, Divider, Grid, Typography } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import 'typeface-roboto';
import { Room } from '../api';
import ApproveSuggestion from '../components/ApproveSuggestion';
import Communication from '../components/Communication';
import EmojiContainer from '../components/EmojiContainer';
import Mp3Player from '../components/Mp3Player';
import PasswordPrompt from '../components/PasswordPrompt';
import PresetWindow from '../components/PresetWindow';
import UserList from '../components/UserList';
import Video from '../components/Video';
import '../style/App.css';

interface AppState {
  userGesture: boolean;
  passwordPrompt: boolean;
  authorized: boolean;
  master: boolean;
  room?: Room;
}
interface RoomProps {
  roomId: string;
}

export default class Roompage extends React.Component<RouteComponentProps<RoomProps>, AppState> {

  constructor(props: RouteComponentProps<RoomProps>) {
    super(props);

    this.state = {
      userGesture: true,
      authorized: false,
      passwordPrompt: false,
      master: false,
    };
  }
  
  receivedUserGesture = () => {
    document.getElementById('start-button-container')?.classList.add('hidden');
    setTimeout(() => {
      this.setState({ userGesture: true });
    }, 500);
  };

  async componentDidMount() {
    const roomId = this.props.match.params.roomId;
    const response = await fetch(`${process.env.REACT_APP_HTTP_URL}/rooms/${roomId}`);
    const room: Room = await response.json();
    this.setState({ room });
    if (room.visibility === 'public') {
      this.setState({ authorized: true });
    } else if(room.visibility === 'password') {
      this.setState({ passwordPrompt: true });
    }
  }

  passwordEntered = async (password: string) => {
    const formData = new FormData();
    formData.append('password', password);
    const requestOptions = {
      method: 'POST',
      body: formData,
    };
    const response = await fetch(`${process.env.REACT_APP_HTTP_URL}/auth/${this.props.match.params.roomId}`, requestOptions);
    if (!response.ok) {
      this.props.history.push('');
    } else {
      const json = await response.json();
      const session: string = json.session;
      localStorage.setItem('session', session);
      localStorage.setItem('roomId', json.room);
      this.setState({ passwordPrompt: false, authorized: true, master: json.master });
    }
  }

  Content = () => {
    if (!this.state.authorized) { return null; }
    if (!this.state.userGesture) {
      return (
        <Grid container justify="center">
          <Button
            variant="contained"
            color="primary"
            className={clsx('start-button')}
            onClick={this.receivedUserGesture}
          >
            Csatlakozás
          </Button>
        </Grid>
      );
    }
    return (
      <Grid container spacing={10} justify="center">
        <Grid item xs={6}>
          <Video videoRole="music" master={this.state.master} />
        </Grid>
        <Grid item xs={6}>
          <Video videoRole="ambience" master={this.state.master}/>
          <Mp3Player master={this.state.master} />
        </Grid>
      </Grid>
    );
  }

  Admin = () => {
    if (!this.state.master) { return null; }
    return (
      <>
        <PresetWindow />
        <div id="dummy-player" className="hidden" />
        <ApproveSuggestion />
      </>
    );
  }

  render() {
    return (
      <>
        <Typography variant="h2" gutterBottom>
          {this.state.room?.name}
        </Typography>
        <Divider variant="fullWidth" />
        <Box m={2}>
          <this.Content />
        </Box>
        <this.Admin />
        { this.state.authorized && <Communication room={this.props.match.params.roomId} /> }
        { this.state.passwordPrompt && <PasswordPrompt callback={this.passwordEntered} roomName={this.state.room?.name ?? ''}/> }
        <UserList />
        <EmojiContainer />
      </>
    );
  }
}