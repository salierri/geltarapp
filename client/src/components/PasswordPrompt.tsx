import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormGroup, TextField } from '@material-ui/core';
import React from 'react';
import 'typeface-roboto';
import '../style/App.css';

interface PasswordPromptProps {
  roomName: string;
  callback: (pass: string) => void;
}

export default class PasswordPrompt extends React.Component<PasswordPromptProps, {}> {
  passField: React.RefObject<HTMLInputElement>;

  constructor(props: PasswordPromptProps) {
    super(props);
    this.passField = React.createRef();
  }

  enterPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    this.props.callback(this.passField.current?.value ?? '');
  };

  render() {
    return (
      <Dialog
        fullWidth
        maxWidth="sm"
        open
        onClose={() => this.props.callback('')}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{this.props.roomName}</DialogTitle>
        <DialogContent>
          <form onSubmit={this.enterPassword}>
            <FormGroup>
              <TextField
                required
                label="Password"
                variant="outlined"
                name="name"
                type="password"
                inputRef={this.passField}
                autoFocus
              />
            </FormGroup>
            <Box m={1}>
              <FormGroup>
                <Button type="submit" color="primary" variant="contained">
                  Enter
                </Button>
              </FormGroup>
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.props.callback('')} color="default">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
