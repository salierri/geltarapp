import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Card, CardContent, Slider, Grid, Button } from '@material-ui/core';
import { VolumeDown, VolumeUp } from '@material-ui/icons';
import clsx from 'clsx';
import Communication from './Communication';
import { VideoRole } from '../api';
import Admin from './Admin';
import { APIReady, setLocalVolume } from './videoPlayer';

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
          <Button
            variant="contained"
            color="primary"
            className={clsx('feedback-button')}
            onClick={() => Communication.sendFeedback('like')}
            startIcon={<span role="img" aria-label="thumbs-up">👍</span>}
          >
            Jó kis zene
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={clsx('feedback-button')}
            onClick={() => Communication.sendFeedback('boring')}
            startIcon={<span role="img" aria-label="sleeping">😴</span>}
          >
            Már unalmas viszonylag
          </Button>
        </div>
      );
    }
    return (
      <Router>
        <Card className={clsx('video-card')}>
          <CardContent>
            <div className="uk-align-center" id={`${this.role}Player`} />
            <Grid container spacing={2}>
              <Grid item>
                <VolumeDown className={clsx('volume-icon')} />
              </Grid>
              <Grid item xs>
                <Slider
                  className={clsx('volume-slider')}
                  defaultValue={+(localStorage.getItem(`localvolume_${this.role.toString()}`) ?? 100)}
                  onChange={(_, newValue) => setLocalVolume(this.role, +newValue)}
                />
              </Grid>
              <Grid item>
                <VolumeUp className={clsx('volume-icon')} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <div id="video uk-align-center">
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
