import React from 'react';
import { createMuiTheme, ThemeProvider, Container, IconButton, Typography, CssBaseline, Divider, Button, Grid, Box, List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, makeStyles, Dialog, DialogTitle, DialogContent, DialogActions, FormGroup, TextField } from '@material-ui/core';
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
  passwordPromptOpen: boolean;
  passwordForRoom?: Room;
}

interface HomepageProps {
  history: History;
}

export default class RoomList extends React.Component<HomepageProps, HomepageState> {
  constructor(props: HomepageProps) {
    super(props);
    this.state = {
      rooms: [],
      loaded: false,
      passwordPromptOpen: false,
    };
  }

  enterRoom = (roomId: string) => {
    const room = this.state.rooms.find(room => room._id === roomId);
    if (room?.visibility === 'password') {
      this.setState({ passwordPromptOpen: true, passwordForRoom: room });
    } else {
      this.props.history.push(`room/${roomId}`);
    }
  };

  enterPassword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.setState({ passwordPromptOpen: false });
    this.props.history.push(`room/${this.state.passwordForRoom?._id}`);
  };

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
      <>
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
      <Dialog
        fullWidth
        maxWidth="sm"
        open={this.state.passwordPromptOpen}
        onClose={() => this.setState({ passwordPromptOpen: false })}
        aria-labelledby="form-dialog-title"
      >
      <DialogTitle id="form-dialog-title">{this.state.passwordForRoom?.name}</DialogTitle>
      <DialogContent>
        <form onSubmit={this.enterPassword}>
          <FormGroup>
            <TextField
              required
              label="Password"
              variant="outlined"
              name="name"
              type="password"
              autoFocus
            />
          </FormGroup>
          <Box m={1}>
          <FormGroup>
            <Button type="submit" color="primary" variant="contained">
              Enter
            </Button>
          </FormGroup>
          </Box>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => this.setState({ passwordPromptOpen: false })} color="default">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
    </>
    );
  }
}
