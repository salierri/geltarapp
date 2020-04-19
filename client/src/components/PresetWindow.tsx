import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Switch, FormControlLabel } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import PresetList, { CollapseOpenObject } from './PresetList';
import CreatePreset from './CreatePreset';

interface PresetWindowState {
  open: boolean;
  editMode: boolean;
  createWindowOpen: boolean;
}

export default class PresetWindow extends React.Component<{}, PresetWindowState> {
  listOpens?: CollapseOpenObject;

  constructor(props: {}) {
    super(props);
    this.state = {
      open: false,
      editMode: false,
      createWindowOpen: false,
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

  toggleEditMode = () => {
    this.setState({ editMode: !this.state.editMode });
  }

  createNewPreset = () => {
    this.setState({ createWindowOpen: true, open: false });
  }

  closeCreateWindow = () => {
    this.setState({ createWindowOpen: false, open: true });
  }

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
              editMode={this.state.editMode}
              closeCallback={this.handleClose}
              destroyedCallback={this.presetListDestroyed}
              open={this.listOpens}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.createNewPreset} color="primary" variant="contained">
              Create new preset
            </Button>
            <FormControlLabel
              control={
                <Switch
                  edge="end"
                  onChange={this.toggleEditMode}
                  checked={this.state.editMode}
                />
              }
              label="Edit mode"
            />
            <Button onClick={this.handleClose} color="default">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <CreatePreset open={this.state.createWindowOpen} closeCallback={this.closeCreateWindow} />
      </ThemeProvider>
    );
  }
}
