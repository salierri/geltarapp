import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import clsx from 'clsx';
import { createMuiTheme, ThemeProvider, Container, IconButton, Typography, CssBaseline, Divider, Button, Grid, Box } from '@material-ui/core';
import { BrightnessHigh, Brightness4 } from '@material-ui/icons';
import './style/App.css';
import Communication from './components/Communication';
import Video from './components/Video';
import EmojiContainer from './components/EmojiContainer';
import Mp3Player from './components/Mp3Player';
import PresetWindow from './components/PresetWindow';
import 'typeface-roboto';
import UserList from './components/UserList';
import Name from './components/Name';
import ApproveSuggestion from './components/ApproveSuggestion';

export default class Homepage extends React.Component<> {
  render() {
    return (
        <Typography variant="h2" gutterBottom>
          Geltarapp
        </Typography>
        <Divider variant="fullWidth" />
    );
  }
}
