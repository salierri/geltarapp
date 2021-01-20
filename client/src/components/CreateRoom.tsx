import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormGroup, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';

interface CreateRoomProps {
  successCallback: () => void;
}

interface CreateRoomState {
  open: boolean;
  passwordField: boolean;
}

export default class CreateRoom extends React.Component<CreateRoomProps, CreateRoomState> {
  form: React.RefObject<HTMLFormElement>;

  constructor(props: CreateRoomProps) {
    super(props);
    this.form = React.createRef();
    this.state = {
      open: false,
      passwordField: true,
    }
  }

  submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!this.form.current) {
      return;
    }
    const requestOptions = {
      method: 'POST',
      body: new FormData(this.form.current),
    };
    fetch(`${process.env.REACT_APP_HTTP_URL}/rooms`, requestOptions);
    this.props.successCallback();
    this.closeWindow();
  };

  closeWindow = () => {
    this.setState({ open: false });
  };

  visibilityChange = (event: React.ChangeEvent<{value: unknown}>, child: React.ReactNode) => {
    this.setState({ passwordField: event.target.value === 'password' });
  }

  render() {
    const passwordField = this.state.passwordField ? (
      <>
      <FormGroup>
        <TextField
          label="Password"
          variant="outlined"
          name="password"
          type="password"
        />
      </FormGroup>
      <FormGroup>
      <TextField
        label="GM Password (Use this for access to the controls)"
        variant="outlined"
        name="masterPassword"
        type="password"
      />
    </FormGroup>
    </>) : null;

    return (
      <>
        <Button
          variant="contained"
          color="primary"
          size="large"
          className={clsx('feedback-button')}
          onClick={() => this.setState({ open: true })}
        >
          Create new Room
        </Button>
        <Dialog
          fullWidth
          maxWidth="lg"
          open={this.state.open}
          onClose={this.closeWindow}
          aria-labelledby="max-width-dialog-title"
        >
          <DialogTitle id="max-width-dialog-title">Create new room</DialogTitle>
          <DialogContent>
            <form onSubmit={this.submit} className="create-new-form" ref={this.form}>
              <FormGroup>
                <TextField
                  required
                  label="Room name"
                  variant="outlined"
                  name="name"
                />
              </FormGroup>
              <InputLabel id="role-select-label">Visibility</InputLabel>
              <FormGroup>
                <Select
                  labelId="role-select-label"
                  name="visibility"
                  defaultValue="password"
                  disabled
                  onChange={this.visibilityChange}
                >
                  <MenuItem value="public">Public</MenuItem>
                  <MenuItem value="password">Password protected</MenuItem>
                  <MenuItem value="private">Private</MenuItem>
                </Select>
              </FormGroup>
              { passwordField }
              <FormGroup>
                <Button type="submit" color="primary" variant="contained">
                  Create
                </Button>
              </FormGroup>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeWindow} color="default">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}
