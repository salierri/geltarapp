import React from 'react';
import './style/App.css';
import Communication from './components/Communication';
import Video from './components/Video';
import EmojiContainer from './components/EmojiContainer';

interface AppState {
  userGesture: boolean
}

class App extends React.Component<{}, AppState> {

  constructor(props: {}) {
    super(props);
    this.state = {
      userGesture: false
    }
    this.Content = this.Content.bind(this);
  }

  receivedUserGesture() {
    document.getElementById("start-button-container")?.classList.add('hidden');
    setTimeout(() => {
      this.setState({userGesture: true});
    }, 500);
  }

  Content() {
    if(this.state.userGesture) {
      return <div className="uk-grid">
              <div className="uk-width-1-2">
                <Video role="music" />
              </div>
              <div className="uk-width-1-2">
                <Video role="ambience" />
              </div>
            </div>;
    } else {
      return <div className="uk-container" id="start-button-container">
        <button className="uk-button start-button uk-align-center" onClick={() => this.receivedUserGesture()}>Csatlakozás</button>
      </div>;
    }
  }

  render() {
    return (
      <div className="App uk-container">
        <header className="App-header">
          <h1 className="uk-padding-small">Geltara zenesarka</h1>
          <hr />
          <this.Content />
        </header>
        <Communication />
        <EmojiContainer />
      </div>
    );
  }
}

export default App;
