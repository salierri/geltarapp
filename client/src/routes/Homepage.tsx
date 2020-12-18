import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import clsx from 'clsx';
import { createMuiTheme, ThemeProvider, Container, IconButton, Typography, CssBaseline, Divider, Button, Grid, Box, List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, makeStyles } from '@material-ui/core';
import { Public, LockOpen, Lock } from '@material-ui/icons';
import '../style/App.css';
import 'typeface-roboto';
import CreateRoom from '../components/CreateRoom';
import { Room, VisibilityType } from '../api';
import RoomList from '../components/RoomList';

export default class Homepage extends React.Component {

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
                <RoomList/>
              </div>
            </Grid>
            <Grid item xs={2}>
              <Box mt={4}>
                <CreateRoom/>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </>
    );
  }
}
