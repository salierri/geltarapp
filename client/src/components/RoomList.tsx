import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Lock, LockOpen, Public } from '@material-ui/icons';
import { History } from 'history';
import React from 'react';
import 'typeface-roboto';
import { Room, VisibilityType } from '../api';
import '../style/App.css';

interface HomepageState {
  rooms: Room[];
  loaded: boolean;
  error?: Error;
  passwordPromptOpen: boolean;
}

interface HomepageProps {
  history: History;
}

export default class RoomList extends React.Component<HomepageProps, HomepageState> {
  constructor(props: HomepageProps) {
    super(props);
    this.state = {
      rooms: [],
      loaded: false,
      passwordPromptOpen: false,
    };
  }

  enterRoom = (roomId: string) => {
    this.props.history.push(`room/${roomId}`);
  };

  componentDidMount = () => {
    fetch(`${process.env.REACT_APP_HTTP_URL}/rooms`).then(
      (response) => response.json()
      ).then((rooms) => {
        this.setState({ rooms, loaded: true });
      },
      (error: Error) => {
      this.setState({
        loaded: true,
        error,
      });
    });
  };

  typeIcon = (visibility: VisibilityType) => {
    if (visibility === 'public') {
      return <Public/>;
    } else if (visibility === 'password') {
      return <LockOpen/>;
    } else if (visibility === 'private') {
      return <Lock/>;
    }
  };

  render() {
    const { error, loaded, rooms } = this.state;
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
      <>
      <List>
        {rooms?.map((room) => (
        <ListItem key={room._id} role={undefined} button onClick={() => this.enterRoom(room._id)}>
          <ListItemIcon>
            {this.typeIcon(room.visibility)}
          </ListItemIcon>
          <ListItemText primary={room.name} />
        </ListItem>
        ))}
      </List>
    </>
    );
  }
}
