import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon, Collapse, Box, ListItemSecondaryAction, IconButton, Typography } from '@material-ui/core';
import AmbienceIcon from '@material-ui/icons/Fireplace';
import MusicIcon from '@material-ui/icons/MusicVideo';
import { ExpandLess, ExpandMore, Delete } from '@material-ui/icons';
import Communication from './Communication';
import { Preset, Category } from '../api';
import * as Helpers from '../helpers/Helpers';
import PresetManager from '../models/PresetManager';

export type CollapseOpenObject = { [key: string]: boolean };

interface PresetListState {
  loaded: boolean;
  presets?: Preset[];
  categories?: Category[];
  error?: Error;
  open: CollapseOpenObject;
}

interface ListProps {
  editMode: boolean;
  closeCallback: () => void;
  destroyedCallback: (open: CollapseOpenObject) => void;
  open?: CollapseOpenObject;
}

export default class PresetList extends React.Component<ListProps, PresetListState> {
  constructor(props: ListProps) {
    super(props);
    this.state = {
      loaded: false,
      open: {},
    };
  }

  componentDidMount = () => {
    this.handleIncomingData(PresetManager.getPresets());
  };

  componentWillUnmount() {
    this.props.destroyedCallback(this.state.open);
  }

  forceDateRequest = () => {
    this.handleIncomingData(PresetManager.forceUpdate());
  };

  handleIncomingData = (promise: Promise<[Preset[], Category[]]>) => {
    promise.then(([presets, categories]) => {
      this.setupOpenState(categories);
      return [presets, categories] as [Preset[], Category[]]; // Why do i need this
    })
      .then(([presets, categories]) => {
        this.setState({
          loaded: true,
          presets,
          categories,
        });
      },
      (error: Error) => {
        this.setState({
          loaded: true,
          error,
        });
      });
  };

  play = (preset: Preset) => {
    Communication.sendCommand('LoadVideo', preset.category.role, preset.url);
    this.props.closeCallback();
  };

  deletePreset = async (preset: Preset) => {
    await fetch(`${process.env.REACT_APP_HTTP_URL}/presets/${preset._id}`, { method: 'DELETE' });
    this.forceDateRequest();
  };

  deleteCategory = async (category: Category) => {
    await fetch(`${process.env.REACT_APP_HTTP_URL}/categories/${category._id}`, { method: 'DELETE' });
    this.forceDateRequest();
  };

  setupOpenState = (categories: Category[]) => {
    if (this.props.open) {
      this.setState({ open: this.props.open });
    } else {
      const allFalse: CollapseOpenObject = {};
      categories.forEach((category) => {
        allFalse[category._id] = false;
      });
      this.setState({ open: allFalse });
    }
  };

  toggleOpen = (category: Category) => {
    this.setState((state) => {
      const toggledOpen = state.open;
      toggledOpen[category._id] = !toggledOpen[category._id];
      return {
        loaded: state.loaded,
        open: toggledOpen,
      };
    });
  };

  render() {
    const { error, loaded, presets, categories, open } = this.state;
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
    const presetEditButtons = (preset: Preset) => (this.props.editMode ? (
      <>
        <IconButton onClick={() => this.deletePreset(preset)}>
          <Delete />
        </IconButton>
      </>
    ) : null);
    const categoryEditButtons = (preset: Category) => (this.props.editMode ? (
      <>
        <IconButton onClick={() => this.deleteCategory(preset)}>
          <Delete />
        </IconButton>
      </>
    ) : null);
    return (
      <List>
        {categories?.map((category) => (
          <>
            <ListItem button key={category._id} onClick={() => this.toggleOpen(category)}>
              <ListItemIcon>
                {category.role === 'music' ? <MusicIcon /> : <AmbienceIcon /> }
              </ListItemIcon>
              <ListItemText primary={category.name} />
              {categoryEditButtons(category)}
              {open[category._id] ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open[category._id]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {presets?.map((preset) => (
                  preset.category._id !== category._id ? null
                    : (
                      <Box pl={7}>
                        <ListItem button onClick={() => this.play(preset)} key={preset._id}>
                          <ListItemText primary={preset.name} secondary={preset.title} />
                          <ListItemSecondaryAction>
                            <Typography variant="inherit">
                              {Helpers.numberToTimeString(preset.length)}
                            </Typography>
                            {presetEditButtons(preset)}
                          </ListItemSecondaryAction>
                        </ListItem>
                      </Box>
                    )))}
              </List>
            </Collapse>
          </>
        ))}
      </List>
    );
  }
}
