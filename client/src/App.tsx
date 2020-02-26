import React from 'react';
import './App.css';
import Communication from './Communication';
import Video from './Video';

let music = {
  role: "music"
}
let ambience = {
  role: "ambience"
}

function App() {
  return (
    <div className="App uk-container">
      <header className="App-header">
        <h1 className="uk-padding-small">Geltara's music corner</h1>
        <hr />
        <div className="uk-grid">
          <div className="uk-width-1-2">
            <Video {...music} />
          </div>
          <div className="uk-width-1-2">
            <Video {...ambience} />
          </div>
        </div>
      </header>
      <Communication />
    </div>
  );
}

export default App;
