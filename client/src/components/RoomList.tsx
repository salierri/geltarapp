import React from 'react';
import { createMuiTheme, ThemeProvider, Container, IconButton, Typography, CssBaseline, Divider, Button, Grid, Box, List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, makeStyles } from '@material-ui/core';
import { Public, LockOpen, Lock } from '@material-ui/icons';
import { Room, VisibilityType } from '../api';
import '../style/App.css';
import CreateRoom from '../components/CreateRoom';
import 'typeface-roboto';
import { withRouter } from 'react-router-dom';
import { History } from 'history';

interface HomepageState {
  rooms: Room[];
  loaded: boolean;
  error?: Error;
}

export default class RoomList extends React.Component<{}, HomepageState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      rooms: [],
      loaded: false,
    };
  }

  enterRoom = (roomId: string) => {
    // this.props.history?.push(`room/${roomId}`);
    // window.history.pushState({"html":"","pageTitle":`Geltarapp: ${roomId}`},"", `${window.location.href}room/${roomId}`);
  }

  componentDidMount = () => {
    fetch(`${process.env.REACT_APP_HTTP_URL}/rooms`).then(
      (response) => response.json()
      ).then((rooms) => {
        this.setState({ rooms, loaded: true });
      },
      (error: Error) => {
      this.setState({
        loaded: true,
        error,
      });
    });
  };

  typeIcon = (visibility: VisibilityType) => {
    if (visibility === 'public') {
      return <Public/>;
    } else if (visibility === 'password') {
      return <LockOpen/>;
    } else if (visibility === 'private') {
      return <Lock/>;
    }
  };

  render() {
    const { error, loaded, rooms } = this.state;
    if (error) {
      return (
        <div>
          Error:
          {error.message}
        </div>
      );
    }
    if (!loaded) {
      return <div>Loading...</div>;
    }
    return (
      <List>
        {rooms?.map((room) => (
        <ListItem key={room._id} role={undefined} button onClick={() => this.enterRoom(room._id)}>
          <ListItemIcon>
            {this.typeIcon(room.visibility)}
          </ListItemIcon>
          <ListItemText primary={room.name} />
        </ListItem>
        ))}
      </List>
    );
  }
}
