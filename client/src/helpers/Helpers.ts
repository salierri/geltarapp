export const isAdmin = () => window.location.href.includes('geltaradmin');

export const youtubeUrlToVideoId = (url: string): string => {
  const urlRegex = /^(?:(?:https?:)?\/\/)?(?:(?:www|m)\.)?(?:(?:youtube\.com|youtu\.be))(?:\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(?:\S+)?$/;

  return url.match(urlRegex)?.[1] ?? '';
};

export const youtubeUrlToTiming = (url: string): number => {
  const timingRegex = /^.*t=(\d+).*$/;

  return +(url.match(timingRegex)?.[1] ?? 0);
};

export const numberToTimeString = (time: number): string => {
  const date = new Date(0);
  date.setSeconds(time);
  const substStart = time > 3600 ? 11 : 14;
  return date.toISOString().substr(substStart, 19 - substStart);
};
