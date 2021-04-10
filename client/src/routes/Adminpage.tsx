import { Typography } from '@material-ui/core';
import React from 'react';
import 'typeface-roboto';
import '../style/App.css';

interface AdminState {
  connections?: number;
  activeRooms?: number;
  allRooms?: number;
  lifetimeSessions?: number;
}

export default class Adminpage extends React.Component<{}, AdminState> {

  getBasicStats = async () => {
    const response = await fetch(`${process.env.REACT_APP_HTTP_URL}/admin/stats`, { credentials: 'include' });
    const stats = await response.json();
    this.setState(stats);
  }

  componentDidMount() {
    this.getBasicStats();
  }

  render() {
    let basicStats = null;
    if (this.state?.connections !== undefined) {
      basicStats = (
        <>
        <Typography variant="h5" gutterBottom>Connections: {this.state.connections}</Typography>
        <Typography variant="h5" gutterBottom>Active rooms: {this.state.activeRooms}</Typography>
        <Typography variant="h5" gutterBottom>All rooms: {this.state.allRooms}</Typography>
        <Typography variant="h5" gutterBottom>Lifetime sessions: {this.state.lifetimeSessions}</Typography>
      </>
      );
    }
    return (
      <>
        <Typography variant="h3" gutterBottom>Hello Mr. Admin</Typography>
        {basicStats}
      </>
    );
  }
}
