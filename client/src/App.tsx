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
import UserList from './components/UserList';
import Name from './components/Name';
import ApproveSuggestion from './components/ApproveSuggestion';
import Homepage from './routes/Homepage';
import Roompage from './routes/Roompage';

declare type ColorMode = 'dark' | 'light';

class App extends React.Component{
  protected currentMode: ColorMode = 'dark';

  constructor(props: {}) {
    super(props);
    this.state = {
      userGesture: false,
    };
  }

  switchMode = () => {
    this.currentMode = this.currentMode === 'light' ? 'dark' : 'light';
    this.forceUpdate();
  };

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
          <Name />
          <IconButton onClick={this.switchMode}>
            {this.currentMode === 'dark' ? <BrightnessHigh /> : <Brightness4 />}
          </IconButton>
        </div>
        <Container>
          <Box m={2}>
            <BrowserRouter>
              <Switch>
                <Route path="/room/:roomId" component={Roompage} />
                <Route path="/" component={Homepage} />
              </Switch>
            </BrowserRouter>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }
}

export default App;
