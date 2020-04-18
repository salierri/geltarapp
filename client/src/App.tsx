import React from 'react';
import './style/App.css';
import Communication from './components/Communication';
import Video from './components/Video';
import EmojiContainer from './components/EmojiContainer';
import Mp3Player from './components/Mp3Player';
import PresetWindow from './components/PresetWindow';

interface AppState {
  userGesture: boolean;
}

class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      userGesture: false,
    };
    this.Content = this.Content.bind(this);
  }

  receivedUserGesture = () => {
    document.getElementById('start-button-container')?.classList.add('hidden');
    setTimeout(() => {
      this.setState({ userGesture: true });
    }, 500);
  };

  Content() {
    if (this.state.userGesture) {
      return (
        <div className="uk-grid">
          <div className="uk-width-1-2">
            <Video videoRole="music" />
          </div>
          <div className="uk-width-1-2">
            <Video videoRole="ambience" />
            <Mp3Player />
          </div>
        </div>
      );
    }
    return (
      <div className="uk-container" id="start-button-container">
        <button type="button" className="uk-button start-button uk-align-center" onClick={this.receivedUserGesture}>Csatlakozás</button>
      </div>
    );
  }

  render() {
    return (
      <div className="App uk-container">
        <header className="App-header">
          <h1 className="uk-padding-small">Geltarapp</h1>
          <hr />
          <this.Content />
        </header>
        <PresetWindow />
        <Communication />
        <EmojiContainer />
      </div>
    );
  }
}

export default App;
