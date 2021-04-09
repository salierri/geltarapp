import { Box, Divider, Grid, Typography } from '@material-ui/core';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import 'typeface-roboto';
import CreateRoom from '../components/CreateRoom';
import FavoriteRoomList from '../components/FavoriteRoomList';
import RoomList from '../components/RoomList';
import '../style/App.css';

export default class Homepage extends React.Component<RouteComponentProps, {}> {

  render() {
    return (
      <>
        <Typography variant="h2" gutterBottom>
          Geltarapp
        </Typography>
        <Divider variant="fullWidth" />
        <Grid item xs={2}>
          <Box mt={4}>
            <CreateRoom />
          </Box>
        </Grid>
        <Box mt={4}>
          <Grid container spacing={10} justify="center">
            <Grid item xs={6}>
              <Typography variant="h4">Recently created rooms</Typography>
              <div className="room-list-parent">
                <RoomList history={this.props.history} />
              </div>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h4">Your past rooms</Typography>
              <div className="room-list-parent">
                <FavoriteRoomList history={this.props.history} />
              </div>
            </Grid>
          </Grid>
        </Box>
      </>
    );
  }
}
