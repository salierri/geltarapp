import { Box, Container, createMuiTheme, CssBaseline, IconButton, ThemeProvider } from '@material-ui/core';
import { Brightness4, BrightnessHigh } from '@material-ui/icons';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import 'typeface-roboto';
import Flash from './components/Flash';
import Footer from './components/Footer';
import { ColorMode, getColorMode, setColorMode } from './helpers/Persistence';
import Adminpage from './routes/Adminpage';
import Homepage from './routes/Homepage';
import Roompage from './routes/Roompage';
import './style/App.css';

class App extends React.Component {
  protected currentMode: ColorMode = getColorMode();

  switchMode = () => {
    this.currentMode = this.currentMode === 'light' ? 'dark' : 'light';
    setColorMode(this.currentMode);
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
        <div className="top-right">
          <IconButton onClick={this.switchMode}>
            {this.currentMode === 'dark' ? <BrightnessHigh /> : <Brightness4 />}
          </IconButton>
        </div>
        <BrowserRouter>
          <Container className="full-height">
            <Box m={2}>
              <Switch>
                <Route path="/room/:roomId" component={Roompage} />
                <Route path="/admin" component={Adminpage} />
                <Route path="/" component={Homepage} />
              </Switch>
              <Route component={Flash} />
            </Box>
          </Container>
          <Route exact path="/" component={Footer} />
        </BrowserRouter>
      </ThemeProvider>
    );
  }
}

export default App;
