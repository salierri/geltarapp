import { Button, Grid, TextField, Typography } from '@material-ui/core';
import React from 'react';
import 'typeface-roboto';
import '../style/App.css';
import { Line } from 'react-chartjs-2';
import { LogEntry } from '../api';

interface Chart {
  labels: string[];
  datasets: [{
    label: string;
    data: number[];
  }];
}

interface AdminState {
  connections?: number;
  activeRooms?: number;
  allRooms?: number;
  lifetimeSessions?: number;
  connectionChartData?: Chart;
  activeRoomChartData?: Chart;
}

export default class Adminpage extends React.Component<{}, AdminState> {
  componentDidMount() {
    this.getBasicStats();
    this.getPastLogs();
  }

  getBasicStats = async () => {
    const response = await fetch(`${process.env.REACT_APP_HTTP_URL}/admin/stats`, { credentials: 'include' });
    const stats = await response.json();
    this.setState(stats);
  };

  getPastLogs = async () => {
    const response = await fetch(`${process.env.REACT_APP_HTTP_URL}/admin/history`, { credentials: 'include' });
    const stats = await response.json();
    let labels: string[] = [];
    let data: number[] = [];
    stats.connections.forEach((doc: LogEntry) => {
      labels.push(new Date(doc.time).toLocaleString('en-US'));
      data.push(+doc.value);
    });
    this.setState({ connectionChartData: {
      labels,
      datasets: [{
        label: 'Connections',
        data,
      }],
    } });
    labels = [];
    data = [];
    stats.activeRooms.forEach((doc: LogEntry) => {
      labels.push(new Date(doc.time).toLocaleString('en-US'));
      data.push(+doc.value);
    });
    this.setState({ activeRoomChartData: {
      labels,
      datasets: [{
        label: 'Active Rooms',
        data,
      }],
    } });
  };

  setPassword = (evt: React.ChangeEvent<HTMLInputElement>) => {
    document.cookie = `X-Admin-Pass=${evt.target.value}; path=/`;
  };

  reload = () => {
    window.location.reload();
  };

  render() {
    let basicStats = null;
    if (this.state?.connections !== undefined) {
      basicStats = (
        <>
          <Typography variant="h5" gutterBottom>
            Connections:
            {this.state.connections}
          </Typography>
          <Typography variant="h5" gutterBottom>
            Active rooms:
            {this.state.activeRooms}
          </Typography>
          <Typography variant="h5" gutterBottom>
            All rooms:
            {this.state.allRooms}
          </Typography>
          <Typography variant="h5" gutterBottom>
            Lifetime sessions:
            {this.state.lifetimeSessions}
          </Typography>
        </>
      );
    } else {
      basicStats = (
        <>
          <Typography variant="h5" gutterBottom>Pass:</Typography>
          <TextField
            onChange={this.setPassword}
          />
          <Button onClick={this.reload}>Check</Button>
        </>
      );
    }
    return (
      <>
        <Typography variant="h3" gutterBottom>
          {this.state?.connections === undefined ? 'You are not an admin 😡' : 'Hello Mr. Admin'}
        </Typography>
        {basicStats}
        <Grid container spacing={10} justify="center">
          <Grid item xs={6}>
            <Typography variant="h4">Connections</Typography>
            { this.state?.connectionChartData ? <Line data={this.state.connectionChartData} /> : null }
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h4">Active rooms</Typography>
            { this.state?.activeRoomChartData ? <Line data={this.state.activeRoomChartData} /> : null }
          </Grid>
        </Grid>
      </>
    );
  }
}
