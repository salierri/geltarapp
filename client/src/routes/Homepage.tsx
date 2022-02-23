import { Box, Divider, Grid, Typography } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import 'typeface-roboto';
import CreateRoom from '../components/CreateRoom';
import FavoriteRoomList from '../components/FavoriteRoomList';
import RoomList from '../components/RoomList';
import '../style/App.css';

const Homepage = () => {
  const history = useHistory();
  return (
    <>
      <Typography variant="h2" gutterBottom>
        Geltarapp
      </Typography>
      <Divider variant="fullWidth" />
      <Grid container justify="center">
        <Grid item>
          <Box mt={4}>
            <CreateRoom />
          </Box>
        </Grid>
      </Grid>
      <Box mt={4}>
        <Grid container spacing={10} justify="center">
          <Grid item xs={6}>
            <Grid container justify="center">
              <Typography variant="h4">Recently created rooms</Typography>
              <div className="room-list-parent">
                <RoomList history={history} />
              </div>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container justify="center">
              <Typography variant="h4">Your past rooms</Typography>
              <div className="room-list-parent">
                <FavoriteRoomList history={history} />
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Homepage;
