import React from 'react';
import { TextField, Button } from '@material-ui/core';
import Communication from './Communication';

interface NameState {
  name: string;
  modifying: boolean;
}

class Name extends React.Component<{}, NameState> {
  nameInput: React.RefObject<HTMLInputElement>;

  constructor(props: {}) {
    super(props);
    this.nameInput = React.createRef();

    let name = localStorage.getItem('displayName');
    if (name == null) {
      name = this.generateRandomName();
    }
    this.state = {
      name,
      modifying: false,
    };
    Communication.subscribe('state', this.sendName);
  }

  generateRandomName = (): string => {
    const randomNum = Math.round(Math.random() * 3000);
    return `user-${randomNum}`;
  };

  sendName = () => {
    Communication.nameUpdate(this.state.name);
  };

  updateInputValue = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      name: evt.target.value,
    });
  };

  setName = () => {
    localStorage.setItem('displayName', this.state.name);
    this.sendName();
    this.setState({ modifying: false });
  };

  startModifying = () => {
    this.setState({ modifying: true });
  };

  render() {
    if (this.state.modifying) {
      return (
        <form onSubmit={this.setName} className="inline">
          <TextField
            value={this.state.name}
            onChange={this.updateInputValue}
            onBlur={this.setName}
            inputRef={this.nameInput}
            autoFocus
          />
          <Button role="button" type="submit">Set Name</Button>
        </form>
      );
    }
    return <span onClick={this.startModifying} onKeyPress={this.startModifying} role="textbox" tabIndex={0} className="clickable-name">{this.state.name}</span>;
  }
}

export default Name;
