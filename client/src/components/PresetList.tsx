import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon, Collapse, Box, ListItemSecondaryAction } from '@material-ui/core';
import AmbienceIcon from '@material-ui/icons/Fireplace';
import MusicIcon from '@material-ui/icons/MusicVideo';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import Communication from './Communication';
import { Preset, Category } from '../api';
import * as Helpers from '../helpers/Helpers';

export type CollapseOpenObject = { [key: string]: boolean };

interface PresetListState {
  loaded: boolean;
  presets?: Preset[];
  categories?: Category[];
  error?: Error;
  open: CollapseOpenObject;
}

interface ListProps {
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
    Promise.all([
      fetch(`${process.env.REACT_APP_HTTP_URL}/presets`),
      fetch(`${process.env.REACT_APP_HTTP_URL}/categories`),
    ])
      .then(([presets, categories]) => Promise.all([presets.json(), categories.json()]))
      .then(([presets, categories]) => {
        this.setupOpenState(categories);
        return [presets, categories];
      })
      .then(
        ([presets, categories]) => {
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
                            <ListItemText primary={Helpers.numberToTimeString(preset.length)} />
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
