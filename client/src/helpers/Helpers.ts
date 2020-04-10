export const isAdmin = () => window.location.href.includes('geltaradmin');

export const youtubeUrlToVideoId = (url: string): string => {
  const urlRegex = /^(?:(?:https?:)?\/\/)?(?:(?:www|m)\.)?(?:(?:youtube\.com|youtu.be))(?:\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(?:\S+)?$/;

  return url.match(urlRegex)?.[1] ?? "";
}

export const youtubeUrlToTiming = (url: string): number => {
  const timingRegex = /^.*t=(\d+).*$/;

  return +(url.match(timingRegex)?.[1] ?? 0);
}
