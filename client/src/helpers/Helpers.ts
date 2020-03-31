export const isAdmin = () => window.location.href.includes('geltaradmin');

export const youtubeUrlToVideoId = (url: string) => url.slice(-11);
