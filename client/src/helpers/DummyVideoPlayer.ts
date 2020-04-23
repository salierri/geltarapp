export interface VideoProperties {
  title: string;
  length: number;
}

let player: YT.Player;

const onPlayerReady = (event: YT.PlayerEvent,
  resolve: (value: VideoProperties | PromiseLike<VideoProperties>) => void) => {
  player.destroy();
  // this is an UNDOCUMENTED Youtube Iframe API feature, but we need it
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolve({ title: (event.target as any).getVideoData().title, length: event.target.getDuration() });
};

const createDummyPlayer = (videoId: string,
  resolve: (value: VideoProperties | PromiseLike<VideoProperties>) => void) => {
  if (typeof YT === 'undefined') {
    resolve({ title: 'Click Connect before using this feature!', length: 0 });
  }
  player = new YT.Player('dummy-player', {
    height: '1',
    width: '1',
    videoId,
    playerVars: {
      controls: 0,
      autoplay: 0,
    },
    events: {
      onReady: (event: YT.PlayerEvent) => onPlayerReady(event, resolve),
    },
  });
};

export const getProperties = (videoId: string): Promise<VideoProperties> =>
  new Promise((resolve) => {
    createDummyPlayer(videoId, resolve);
  });
