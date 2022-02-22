import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Switch, FormControlLabel } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import PresetList, { CollapseOpenObject } from './PresetList';
import CreatePreset from './CreatePreset';
import CreateCategory from './CreateCategory';
import PresetManager from '../models/PresetManager';

interface PresetWindowState {
  open: boolean;
  editMode: boolean;
  createPresetWindowOpen: boolean;
  createCategoryWindowOpen: boolean;
  error?: string;
}

export default class PresetWindow extends React.Component<{}, PresetWindowState> {
  listOpens?: CollapseOpenObject;

  constructor(props: {}) {
    super(props);
    this.state = {
      open: false,
      editMode: false,
      createPresetWindowOpen: false,
      createCategoryWindowOpen: false,
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
    this.setState((state) => ({ editMode: !state.editMode }));
  };

  createNewPreset = () => {
    if (PresetManager.getCachedCategories().length === 0) {
      this.setState({ error: 'Create a category first!' });
    } else {
      this.setState({ createPresetWindowOpen: true, open: false });
    }
  };

  closeCreatePresetWindow = () => {
    this.setState({ createPresetWindowOpen: false, open: true });
  };

  createNewCategory = () => {
    this.setState({ createCategoryWindowOpen: true, open: false });
  };

  closeCreateCategoryWindow = () => {
    this.setState({ createCategoryWindowOpen: false, open: true });
  };

  closeError = () => {
    this.setState({ error: undefined });
  };

  render() {
    let error: JSX.Element | null = null;
    if (this.state.error) {
      error = <Alert severity="error" onClose={this.closeError}>{this.state.error}</Alert>;
    }
    return (
      <>
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
            {error}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.createNewPreset} color="primary" variant="contained">
              Create new preset
            </Button>
            <Button onClick={this.createNewCategory} color="primary" variant="contained">
              Create new category
            </Button>
            <FormControlLabel
              control={(
                <Switch
                  edge="end"
                  onChange={this.toggleEditMode}
                  checked={this.state.editMode}
                />
              )}
              label="Delete mode"
            />
            <Button onClick={this.handleClose} color="default">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <CreatePreset
          open={this.state.createPresetWindowOpen}
          closeCallback={this.closeCreatePresetWindow}
        />
        <CreateCategory
          open={this.state.createCategoryWindowOpen}
          closeCallback={this.closeCreateCategoryWindow}
        />
      </>
    );
  }
}
