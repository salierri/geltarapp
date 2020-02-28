interface Players {
    music?: YT.Player
    ambience?: YT.Player
}

let players: Players = { };

export function APIReady() {
    players.music = new YT.Player('musicPlayer', {
        height: '243',
        width: '400',
        videoId: 'm_8QMAChwtg',
        playerVars: {
            controls: 0,
            autoplay: 1
        },
        events: {
          'onReady': onPlayerReady
        }
    });
    players.ambience = new YT.Player('ambiencePlayer', {
        height: '243',
        width: '400',
        videoId: 'sGkh1W5cbH4',
        playerVars: {
            controls: 0,
            autoplay: 1
        },
        events: {
          'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event: YT.PlayerEvent) {
    //event.target.playVideo();
}