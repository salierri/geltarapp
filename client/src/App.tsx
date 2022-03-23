import { AppBar, Box, Container, createMuiTheme, CssBaseline, Grid, IconButton, Link, ThemeProvider, Toolbar, Typography } from '@material-ui/core';
import { Brightness4, BrightnessHigh } from '@material-ui/icons';
import React from 'react';
import GitHubButton from 'react-github-btn';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import 'typeface-roboto';
import Flash from './components/Flash';
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
        <Container className="full-height">
          <Box m={2}>
            <BrowserRouter>
              <Switch>
                <Route path="/room/:roomId" component={Roompage} />
                <Route path="/admin" component={Adminpage} />
                <Route path="/" component={Homepage} />
              </Switch>
              <Route component={Flash} />
            </BrowserRouter>
          </Box>
        </Container>
        <AppBar position="sticky" className="bottom-0" color="inherit">
          <Container maxWidth="md">
            <Toolbar>
              <Grid
                justify="space-between"
                alignItems="center"
                container
              >
                <Grid item>
                  <Typography variant="body2" color="inherit">
                    Created by
                    {' '}
                    <Link href="https://github.com/salierri" color="inherit">@Salierri</Link>
                  </Typography>
                </Grid>
                <Grid item className="no-padding">
                  <Typography variant="body2" color="inherit" className="no-padding">
                    <Link href="https://github.com/salierri/geltarapp/issues" color="inherit">Report a bug</Link>
                  </Typography>
                </Grid>
                <Grid item>
                  <GitHubButton
                    href="https://github.com/salierri/geltarapp"
                    data-color-scheme="no-preference: dark; light: light; dark: dark;"
                    data-icon="octicon-star"
                    data-size="large"
                    aria-label="Star salierri/geltarapp on GitHub"
                  >
                    Star me on GitHub
                  </GitHubButton>
                </Grid>
              </Grid>
            </Toolbar>
          </Container>
        </AppBar>
      </ThemeProvider>
    );
  }
}

export default App;
