export const youtubeUrlToVideoId = (url: string): string | undefined => {
  const urlRegex = /^(?:(?:https?:)?\/\/)?(?:(?:www|m)\.)?(?:(?:youtube\.com|youtu\.be))(?:\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(?:\S+)?$/;

  return url.match(urlRegex)?.[1];
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

export const toHHMMSS = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - (hours * 3600)) / 60);
  seconds = Math.floor(seconds - (hours * 3600) - (minutes * 60));

  let hoursString: string;
  if (hours === 0) {
    hoursString = '';
  } else if (hours < 10) {
    hoursString = `0${hours}:`;
  } else {
    hoursString = `${hours}:`;
  }
  const minutesString = minutes < 10 ? `0${minutes}:` : `${minutes}:`;
  const secondsString = seconds < 10 ? `0${seconds}` : seconds;
  return hoursString + minutesString + secondsString;
};
