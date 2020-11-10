import React from 'react';
import { Card, CardContent, Typography, Box } from '@material-ui/core';
import { UserBroadcast } from '../api';
import Communication from './Communication';

interface UserListState {
  users: { [key: string]: string };
}

export default class UserList extends React.Component<{}, UserListState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      users: {},
    };
  }

  componentDidMount = () => {
    Communication.subscribe('users', (usersList) => this.setState({ users: (usersList as UserBroadcast).users }));
  };

  render() {
    return (
      <div className="bottom-left">
        { Object.values(this.state.users).map((name) => (
          <Box m={1} width={180}>
            <Card variant="outlined">
              <CardContent className="flex-center">
                <Typography variant="button">
                  {name}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        )) }
      </div>
    );
  }
}
