interface Players {
    music?: YT.Player
    ambience?: YT.Player
}

let players: Players = { };
let autoplay: number = 0;

function createPlayer(elementId: string, video: string) {
    return new YT.Player(elementId, {
        height: '243',
        width: '400',
        videoId: video,
        playerVars: {
            controls: 0,
            autoplay: autoplay,
            loop: 1
        },
        events: {
          'onReady': onPlayerReady
        }
    });
}

export function APIReady() {
    players.music = createPlayer('musicPlayer', 'm_8QMAChwtg');
    players.ambience = createPlayer('ambiencePlayer', 'sGkh1W5cbH4');
}

function onPlayerReady(event: YT.PlayerEvent) {
    //event.target.playVideo();
}