import React from 'react';
import { APIReady, localVolume } from './videoPlayer';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Admin from './Admin';
import { VideoType } from '../server';

export interface VideoProps {
    role: VideoType
}

declare global {
    interface Window { onYouTubeIframeAPIReady: any }
}

let APIloaded :boolean = false;

class Video extends React.Component<VideoProps, Object> {

    role: VideoType;

    constructor(props: VideoProps) {
        super(props);
        this.role = props.role;
        window.onYouTubeIframeAPIReady = APIReady;
    }

    render() {
        let feedbackButtons;
        if(this.role === "music") {
            feedbackButtons = <div className="feedback-container">
                <button className="feedback-button uk-button uk-align-center">
                    <span role="img" aria-label="thumbs-up">👍</span> Jó kis zene
                    </button>
                <button className="feedback-button uk-button uk-align-center">
                    <span role="img" aria-label="sleeping">😴</span> Már unalmas viszonylag
                    </button>
            </div>
        }
        return (
            <Router>
               <div id="video uk-align-center">
                    <div className="uk-align-center" id={this.role + "Player"}></div>
                    <input type="range" className="uk-range volume-slider uk-align-center" min="0" max="100"
                     defaultValue={+(localStorage.getItem("localvolume_" + this.role.toString()) ?? 100)}
                     onInput={e => localVolume(this.role, (e.target as any).value) } />
                    <Switch>
                        <Route path="/geltaradmin">
                            <Admin role={this.role} />
                        </Route>
                        <Route path="/">
                            {feedbackButtons}
                        </Route>
                    </Switch>
                </div>
            </Router>
        );
    }

    componentDidMount() {
        if(APIloaded) {
            return;
        }
        var tag = document.createElement('script');

        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        APIloaded = true;
    }
}

export default Video;
