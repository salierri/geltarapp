import React from 'react';
import { VideosReady } from './Communication';

export interface VideoProps {
    role: string
}
let APIloaded :boolean = false;

function youTubeIframeAPIReady() {
    console.log("api ready");
    VideosReady();
}


class Video extends React.Component {
    role: string;
    constructor(props: VideoProps) {
        super(props);
        this.role = props.role;
        (window as any).onYouTubeIframeAPIReady = youTubeIframeAPIReady;
    }

    render() {
        return (
            <div id="video uk-align-center">
                <div className="uk-align-center" id={this.role + "Player"}></div>
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
