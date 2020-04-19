import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, FormGroup, InputLabel, Input } from '@material-ui/core';
import { Category } from '../api';
import Presets from '../models/Presets';

interface CreatePresetProps {
  open: boolean;
  closeCallback: () => void;
}

interface CreatePresetState {
  selectedCategory: Category;
}

export default class CreatePreset extends React.Component<CreatePresetProps, CreatePresetState> {
  form: React.RefObject<HTMLFormElement>;

  constructor(props: CreatePresetProps) {
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
    }
    fetch(`${process.env.REACT_APP_HTTP_URL}/presets`, requestOptions);
    Presets.forceUpdate();
    this.props.closeCallback();
  }

  render() {
    return (
      <Dialog
        fullWidth
        maxWidth="lg"
        open={this.props.open}
        onClose={this.props.closeCallback}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle id="max-width-dialog-title">Create new preset</DialogTitle>
        <DialogContent>
          <form onSubmit={this.submit} className="create-new-form" ref={this.form} >
            <FormGroup>
              <TextField
                id="outlined-helperText"
                label="Video name"
                variant="outlined"
                name="name"
              />
            </FormGroup>
            <FormGroup>
              <TextField
                id="outlined-helperText"
                label="Youtube URL"
                variant="outlined"
                name="url"
              />
            </FormGroup>
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <FormGroup>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Category"
                name="category"
              >
                <MenuItem value={"5e945c876c143711a779b7d6"}>5e945c876c143711a779b7d6</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormGroup>
            <FormGroup>
              <Button type="submit" color="primary" variant="contained" >
                Create
              </Button>
            </FormGroup>
            <Input type="hidden" name="length" value="1234"></Input>
            <Input type="hidden" name="title" value="NIGHTWISH - Music (Official Lyric Video)"></Input>
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
