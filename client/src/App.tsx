import React from 'react';
import './style/App.css';
import Communication from './components/Communication';
import Video from './components/Video';

function App() {
  return (
    <div className="App uk-container">
      <header className="App-header">
        <h1 className="uk-padding-small">Geltara zenedoboza</h1>
        <hr />
        <div className="uk-grid">
          <div className="uk-width-1-2">
            <Video role="music" />
          </div>
          <div className="uk-width-1-2">
            <Video role="ambience" />
          </div>
        </div>
      </header>
      <Communication />
    </div>
  );
}

export default App;
