import React, {RefObject} from 'react';
import {TextField} from "@material-ui/core";
import Communication from "./Communication";
import {Simulate} from "react-dom/test-utils";

interface NameState {
    name: string,
    modifying: boolean,
    myRef: RefObject<HTMLInputElement>
}

class Name extends React.Component<{}, NameState>{

    constructor(props: {}) {
        super(props);
        let random = Math.round(Math.random()*3000);
        this.state = {
            name: "user-" + random,
            modifying: false,
            myRef: React.createRef()
        }
    }

    updateInputValue = (evt: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            name: evt.target.value
        });
    };

    setName = () => {
        Communication.nameUpdate(this.state.name)
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
            nameHTML =  (
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
