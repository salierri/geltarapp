import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import 'typeface-roboto';
import '../style/App.css';
import { Line } from 'react-chartjs-2';

interface AdminState {
  connections?: number;
  activeRooms?: number;
  allRooms?: number;
  lifetimeSessions?: number;
  connectionChartData?: any;
  activeRoomChartData?: any;
}

export default class Adminpage extends React.Component<{}, AdminState> {

  getBasicStats = async () => {
    const response = await fetch(`${process.env.REACT_APP_HTTP_URL}/admin/stats`, { credentials: 'include' });
    const stats = await response.json();
    this.setState(stats);
  }

  getPastLogs = async () => {
    const response = await fetch(`${process.env.REACT_APP_HTTP_URL}/admin/history`, { credentials: 'include' });
    const stats = await response.json();
    let labels: string[] = [];
    let data: number[] = []
    stats.connections.forEach((doc: any) => {
      labels.push(new Date(doc.time).toLocaleString("en-US"));
      data.push(doc.value);
    });
    this.setState({connectionChartData: {
      labels,
      datasets: [ {
        label: 'Connections',
        data,
      }, ],
    }});
    labels = [];
    data = [];
    stats.activeRooms.forEach((doc: any) => {
      labels.push(new Date(doc.time).toLocaleString("en-US"));
      data.push(doc.value);
    });
    this.setState({activeRoomChartData: {
      labels,
      datasets: [ {
        label: 'Active Rooms',
        data,
      }, ],
    }});
  }

  componentDidMount() {
    this.getBasicStats();
    this.getPastLogs();
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
