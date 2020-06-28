import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import clsx from 'clsx';
import { createMuiTheme, ThemeProvider, Container, IconButton, Typography, CssBaseline, Divider, Button, Grid, Box } from '@material-ui/core';
import { BrightnessHigh, Brightness4 } from '@material-ui/icons';
import './style/App.css';
import Communication from './components/Communication';
import Video from './components/Video';
import EmojiContainer from './components/EmojiContainer';
import Mp3Player from './components/Mp3Player';
import PresetWindow from './components/PresetWindow';
import 'typeface-roboto';
import Name from "./components/Name";

interface AppState {
  userGesture: boolean;
}

declare type ColorMode = 'dark' | 'light';

class App extends React.Component<{}, AppState> {
  protected currentMode: ColorMode = 'dark';

  constructor(props: {}) {
    super(props);
    this.state = {
      userGesture: false,
    };
    this.Content = this.Content.bind(this);
  }

  receivedUserGesture = () => {
    document.getElementById('start-button-container')?.classList.add('hidden');
    setTimeout(() => {
      this.setState({ userGesture: true });
    }, 500);
  };

  switchMode = () => {
    this.currentMode = this.currentMode === 'light' ? 'dark' : 'light';
    this.forceUpdate();
  };

  Content() {
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
    document.documentElement.setAttribute('data-theme', this.currentMode);
    const darkTheme = createMuiTheme({
      palette: {
        type: this.currentMode,
      },
      overrides: {
        MuiSlider: {
          track: { backgroundColor: '#90caf9' },
          thumb: { backgroundColor: '#90caf9' },
        },
      },
    });
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <div className="temporary-top-right">
          <IconButton onClick={this.switchMode}>
            {this.currentMode === 'dark' ? <BrightnessHigh /> : <Brightness4 />}
          </IconButton>
        </div>
        <div><Name></Name></div>
        <Container>
          <Box m={2}>
            <Typography variant="h2" gutterBottom>
              Geltarapp
            </Typography>
            <Divider variant="fullWidth" />
            <Box m={2}>
              <this.Content />
            </Box>
            <BrowserRouter>
              <Switch>
                <Route path="/geltaradmin">
                  <PresetWindow />
                  <div id="dummy-player" className="hidden" />
                </Route>
              </Switch>
            </BrowserRouter>
            <Communication />
            <EmojiContainer />
          </Box>
        </Container>
      </ThemeProvider>
    );
  }
}

export default App;
