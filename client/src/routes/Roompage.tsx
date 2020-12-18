import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import clsx from 'clsx';
import { createMuiTheme, ThemeProvider, Container, IconButton, Typography, CssBaseline, Divider, Button, Grid, Box } from '@material-ui/core';
import { BrightnessHigh, Brightness4 } from '@material-ui/icons';
import '../style/App.css';
import Communication from '../components/Communication';
import Video from '../components/Video';
import EmojiContainer from '../components/EmojiContainer';
import Mp3Player from '../components/Mp3Player';
import PresetWindow from '../components/PresetWindow';
import 'typeface-roboto';
import UserList from '../components/UserList';
import Name from '../components/Name';
import ApproveSuggestion from '../components/ApproveSuggestion';

interface AppState {
  userGesture: boolean;
}

export default class Roompage extends React.Component<{}, AppState> {

  constructor(props: {}) {
    super(props);
    this.state = {
      userGesture: true,
    };
  }
  
  receivedUserGesture = () => {
    document.getElementById('start-button-container')?.classList.add('hidden');
    setTimeout(() => {
      this.setState({ userGesture: true });
    }, 500);
  };

  Content = () => {
    if (this.state.userGesture) {
      return (
        <Grid container spacing={10} justify="center">
          <Grid item xs={6}>
            <Video videoRole="music" />
          </Grid>
          <Grid item xs={6}>
            <Video videoRole="ambience" />
            <Mp3Player />
          </Grid>
        </Grid>
      );
    }
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

  render() {
    return (
      <>
        <Typography variant="h2" gutterBottom>
          Geltarapp
        </Typography>
        <Divider variant="fullWidth" />
        <Box m={2}>
          <this.Content />
        </Box>
        <BrowserRouter>
          <Switch>
            <Route path="/:params*/geltaradmin">
              <PresetWindow />
              <div id="dummy-player" className="hidden" />
              <ApproveSuggestion />
            </Route>
          </Switch>
        </BrowserRouter>
        <Communication />
        <UserList />
        <EmojiContainer />
      </>
    );
  }
}