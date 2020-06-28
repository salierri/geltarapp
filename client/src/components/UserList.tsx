import React from 'react';
import Communication from './Communication';
import { UserBroadcast } from '../api';

interface UserListState {
  names: string[];
}

export default class UserList extends React.Component<{}, UserListState> {

  constructor(props: {}) {
    super(props);
    this.state = {
      names: []
    }
  }

  componentDidMount = () => {
    Communication.subscribe('users', (usersList) => this.setState({ names: (usersList as UserBroadcast).names }));
  };

  render() {
    return (
      <div>
        { this.state.names.map((name) => (
          <div>{name}</div>
        )) }
      </div>
    );
  }
}
