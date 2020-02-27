import React from 'react';
import { VideosReady } from './Communication';

export interface VideoProps {
    role: string
}

declare global {
    interface Window { onYouTubeIframeAPIReady: any }
}

let APIloaded :boolean = false;

function youTubeIframeAPIReady() {
    console.log("api ready");
    VideosReady();
}


class Video extends React.Component<VideoProps, Object> {

    role: string;

    constructor(props: VideoProps) {
        super(props);
        this.role = props.role;
        window.onYouTubeIframeAPIReady = youTubeIframeAPIReady;
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
            <div id="video uk-align-center">
                <div className="uk-align-center" id={this.role + "Player"}></div>
                <input type="range" className="uk-range volume-slider uk-align-center" min="0" max="100" value="100" />
                {feedbackButtons}
            </div>
        );
    }

    componentDidMount() {
        if(APIloaded) {
            return;
        }
        var tag = document.createElement('script');

        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        if(firstScriptTag.parentNode) {
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
        APIloaded = true;
    }
}

export default Video;
