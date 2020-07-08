import React, {RefObject} from 'react';
import Communication from "./Communication";
import { triggerAsyncId } from 'async_hooks';

interface NameState {
  name: string,
  modifying: boolean,
  myRef: RefObject<HTMLInputElement>
}

class Name extends React.Component<{}, NameState> {
  constructor(props: {}) {
    super(props);
    let name = localStorage.getItem('displayName');
    if(name == null) {
      name = this.generateRandomName();
    }
    this.state = {
      name,
      modifying: false,
      myRef: React.createRef()
    }
    Communication.subscribe("state", this.sendName);
  }

  generateRandomName = () :string => {
    let randomNum = Math.round(Math.random() * 3000);
    return `user-${randomNum}`;
  }

  sendName = () => {
    Communication.nameUpdate(this.state.name);
  }

  updateInputValue = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      name: evt.target.value
    });
  };

  setName = () => {
    localStorage.setItem('displayName', this.state.name);
    this.sendName();
    this.setState({modifying: false})
  }

  startModifying = () => {
    this.setState({modifying: true});
    if (this.state.myRef.current) {
      this.state.myRef.current.focus()
    }
  }

  render() {
    let nameHTML;
    if (this.state.modifying) {
      nameHTML = (
        <>
          <input value={this.state.name} onChange={this.updateInputValue} onBlur={this.setName} ref={this.state.myRef}/>
          <button onClick={this.setName}>Set Name</button>
        </>);
    } else {
      nameHTML = <span onClick={this.startModifying}>{this.state.name}</span>
    }
    return <div>
      {nameHTML}
    </div>
  }
}

export default Name;
