import { Box, Divider, Grid, Typography } from '@material-ui/core';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import 'typeface-roboto';
import CreateRoom from '../components/CreateRoom';
import RoomList from '../components/RoomList';
import '../style/App.css';

interface HomepageState {
  refreshRoomList: boolean;
}

export default class Homepage extends React.Component<RouteComponentProps, HomepageState> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      refreshRoomList: false,
    }
  }

  newRoomCreated = () => {
    this.setState({ refreshRoomList: !this.state.refreshRoomList });
  }

  render() {
    return (
      <>
        <Typography variant="h2" gutterBottom>
          Geltarapp
        </Typography>
        <Divider variant="fullWidth" />
        <Box mt={4}>
          <Grid container spacing={10} justify="center">
            <Grid item xs={6}>
              <Typography variant="h4">Rooms</Typography>
              <div className="room-list-parent">
                <RoomList history={this.props.history}/>
              </div>
            </Grid>
            <Grid item xs={2}>
              <Box mt={4}>
                <CreateRoom successCallback={this.newRoomCreated} />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </>
    );
  }
}
