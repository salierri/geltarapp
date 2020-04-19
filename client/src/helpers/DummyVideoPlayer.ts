export interface VideoProperties {
  title: string;
  length: number;
}

const onPlayerReady = (event: YT.PlayerEvent,
  resolve: (value: VideoProperties | PromiseLike<VideoProperties>) => void) =>
  // this is an UNDOCUMENTED Youtube Iframe API feature, but we need it
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolve({ title: (event.target as any).getVideoData().title, length: event.target.getDuration() });

const createDummyPlayer = (videoId: string,
  resolve: (value: VideoProperties | PromiseLike<VideoProperties>) => void) =>
  new YT.Player('dummy-player', {
    height: '1',
    width: '1',
    videoId,
    playerVars: {
      controls: 0,
      autoplay: 0,
    },
    events: {
      onReady: (event) => onPlayerReady(event, resolve),
    },
  });

export const getProperties = (videoId: string): Promise<VideoProperties> =>
  new Promise((resolve) => {
    createDummyPlayer(videoId, resolve);
  });
