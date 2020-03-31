import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { APIReady, setLocalVolume } from './videoPlayer';
import Admin from './Admin';
import { VideoRole } from '../api';
import Communication from './Communication';

interface VideoProps {
  videoRole: VideoRole;
}

declare global {
  interface Window { onYouTubeIframeAPIReady: () => void } // To prepare window object for the future callback
}

let APIloaded = false;

class Video extends React.Component<VideoProps, {}> {
  role: VideoRole;

  constructor(props: VideoProps) {
    super(props);
    this.role = props.videoRole;
    window.onYouTubeIframeAPIReady = APIReady;
  }

  componentDidMount() {
    if (APIloaded) {
      return;
    }
    const tag = document.createElement('script');

    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        APIloaded = true;
  }

  render() {
    let feedbackButtons;
    if (this.role === 'music') {
      feedbackButtons = (
        <div className="feedback-container">
          <button type="button" className="feedback-button uk-button uk-align-center" onClick={() => Communication.sendFeedback('like')}>
            <span role="img" aria-label="thumbs-up">👍</span>
            {' '}
            Jó kis zene
          </button>
          <button type="button" className="feedback-button uk-button uk-align-center" onClick={() => Communication.sendFeedback('boring')}>
            <span role="img" aria-label="sleeping">😴</span>
            {' '}
            Már unalmas viszonylag
          </button>
        </div>
      );
    }
    return (
      <Router>
        <div id="video uk-align-center">
          <div className="uk-align-center" id={`${this.role}Player`} />
          <input
            type="range"
            className="uk-range volume-slider uk-align-center"
            min="0"
            max="100"
            defaultValue={+(localStorage.getItem(`localvolume_${this.role.toString()}`) ?? 100)}
            onChange={(e) => setLocalVolume(this.role, +e.target.value)}
          />
          <Switch>
            <Route path="/geltaradmin">
              <Admin role={this.role} />
            </Route>
            <Route path="/">
              { feedbackButtons }
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default Video;
