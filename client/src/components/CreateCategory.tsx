import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, FormGroup, InputLabel } from '@material-ui/core';
import PresetManager from '../models/PresetManager';

interface CreateCategoryProps {
  open: boolean;
  closeCallback: () => void;
}

export default class CreateCategory extends React.Component<CreateCategoryProps, {}> {
  form: React.RefObject<HTMLFormElement>;

  constructor(props: CreateCategoryProps) {
    super(props);
    this.form = React.createRef();
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
    fetch(`${process.env.REACT_APP_HTTP_URL}/categories`, requestOptions);
    PresetManager.forceUpdate();
    this.props.closeCallback();
  };

  render() {
    return (
      <Dialog
        fullWidth
        maxWidth="lg"
        open={this.props.open}
        onClose={this.props.closeCallback}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle id="max-width-dialog-title">Create new category</DialogTitle>
        <DialogContent>
          <form onSubmit={this.submit} className="create-new-form" ref={this.form}>
            <FormGroup>
              <TextField
                label="Category name"
                variant="outlined"
                name="name"
              />
            </FormGroup>
            <InputLabel id="role-select-label">Role</InputLabel>
            <FormGroup>
              <Select
                labelId="role-select-label"
                name="role"
                defaultValue="music"
              >
                <MenuItem value="music">Music</MenuItem>
                <MenuItem value="ambience">Ambience</MenuItem>
              </Select>
            </FormGroup>
            <FormGroup>
              <Button type="submit" color="primary" variant="contained">
                Create
              </Button>
            </FormGroup>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.closeCallback} color="default">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
