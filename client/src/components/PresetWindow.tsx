import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import PresetList, { CollapseOpenObject } from './PresetList';

interface PresetWindowState {
  open: boolean;
}

export default class PresetWindow extends React.Component<{}, PresetWindowState> {
  listOpens?: CollapseOpenObject;

  constructor(props: {}) {
    super(props);
    this.state = {
      open: false,
    };
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  presetListDestroyed = (open: CollapseOpenObject) => {
    this.listOpens = open;
  };

  render() {
    const darkTheme = createMuiTheme({
      palette: {
        type: 'light',
      },
    });
    return (
      <ThemeProvider theme={darkTheme}>
        <Button variant="contained" color="primary" onClick={this.handleClickOpen}>
          Show Presets
        </Button>
        <Dialog
          fullWidth
          maxWidth="lg"
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="max-width-dialog-title"
        >
          <DialogTitle id="max-width-dialog-title">Preset Videos</DialogTitle>
          <DialogContent>
            <PresetList
              closeCallback={this.handleClose}
              destroyedCallback={this.presetListDestroyed}
              open={this.listOpens}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="default">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    );
  }
}
