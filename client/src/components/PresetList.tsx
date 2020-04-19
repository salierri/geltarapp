import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon, Collapse, Box, ListItemSecondaryAction, IconButton, Typography } from '@material-ui/core';
import AmbienceIcon from '@material-ui/icons/Fireplace';
import MusicIcon from '@material-ui/icons/MusicVideo';
import { ExpandLess, ExpandMore, Delete, Edit } from '@material-ui/icons';
import Communication from './Communication';
import { Preset, Category } from '../api';
import * as Helpers from '../helpers/Helpers';
import Presets from '../models/Presets';

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
    if (process.env.REACT_APP_HTTP_URL === null) {
      this.setState({ error: { name: 'No env vars', message: 'Environment variables not set!' } });
      return;
    }
    Presets.getPresets()
      .then(([presets, categories]) => {
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
        },
      );
  };

  componentWillUnmount() {
    this.props.destroyedCallback(this.state.open);
  }

  play = (preset: Preset) => {
    Communication.sendCommand('LoadVideo', preset.category.role, preset.url);
    this.props.closeCallback();
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
    const editButtons = this.props.editMode ? (
      <>
        <IconButton >
          <Edit />
        </IconButton>
        <IconButton >
          <Delete />
        </IconButton>
      </>
    ) : null;
    return (
      <List>
        {categories?.map((category) => (
          <>
            <ListItem button key={category._id} onClick={() => this.toggleOpen(category)}>
              <ListItemIcon>
                {category.role === 'music' ? <MusicIcon /> : <AmbienceIcon /> }
              </ListItemIcon>
              <ListItemText primary={category.name} />
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
                              {editButtons}
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
