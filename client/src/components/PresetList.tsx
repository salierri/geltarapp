import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import AmbienceIcon from '@material-ui/icons/ArtTrack';
import MusicIcon from '@material-ui/icons/MusicVideo';
import Communication from './Communication';

interface PresetListState {
  loaded: boolean;
  presets: any;
  error: any;
}

interface ListProps {
  closeCallback: () => void;
}

export default class PresetList extends React.Component<ListProps, PresetListState> {
  constructor(props: ListProps) {
    super(props);
    this.state = {
      loaded: false,
      presets: null,
      error: null,
    };
  }

  componentDidMount() {
    if (process.env.REACT_APP_HTTP_URL === null) {
      this.setState({ error: 'Environment variables not set!' });
      return;
    }
    fetch(`${process.env.REACT_APP_HTTP_URL}/presets`)
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            loaded: true,
            presets: result,
          });
        },
        (error) => {
          this.setState({
            loaded: true,
            error,
          });
        },
      );
  }

  play = (preset: any) => {
    Communication.sendCommand('LoadVideo', preset.category.role, preset.url);
    this.props.closeCallback();
  };

  render() {
    const { error, loaded, presets } = this.state;
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
        {presets.map((preset: any) => (
          <ListItem button onClick={() => this.play(preset)} key={preset._id}>
            <ListItemIcon>
              {preset.category.role === 'music' ? <MusicIcon /> : <AmbienceIcon /> }
            </ListItemIcon>
            <ListItemText primary={preset.name} secondary={preset.title} />
          </ListItem>
        ))}
      </List>
    );
  }
}
