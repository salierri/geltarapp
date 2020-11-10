import React from 'react';
import { Card, CardContent, Typography, Box } from '@material-ui/core';
import { UserBroadcast } from '../api';
import Communication from './Communication';

interface UserListState {
  names: string[];
}

export default class UserList extends React.Component<{}, UserListState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      names: [],
    };
  }

  componentDidMount = () => {
    Communication.subscribe('users', (usersList) => this.setState({ names: (usersList as UserBroadcast).names }));
  };

  render() {
    return (
      <div className="bottom-left">
        { this.state.names.map((name) => (
          <Box m={1}>
            <Card variant="outlined">
              <CardContent>
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
