export interface SavedSession {
  sessionId: string;
  room: string;
  master: boolean;
}

export const saveSession = (session: SavedSession) => {
  localStorage.setItem('sessionId', session.sessionId);
  localStorage.setItem('roomId', session.room);
  localStorage.setItem('master', JSON.stringify(session.master));
}

export const forgetSession = () => {
  localStorage.removeItem('sessionId');
  localStorage.removeItem('roomId');
  localStorage.removeItem('master');
}

export const savedSessionExists = () : boolean => {
  return localStorage.getItem('sessionId') !== null;
}

export const getSession = () : SavedSession => {
  if (!savedSessionExists()) {
    throw new ReferenceError('Recalling non-existing session!');
  }
  return {
    sessionId: localStorage.getItem('sessionId') ?? '',
    room: localStorage.getItem('roomId') ?? '',
    master: JSON.parse(localStorage.getItem('master') ?? '') };
}
