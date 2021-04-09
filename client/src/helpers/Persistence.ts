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

export const addFavoriteRoom = (roomId: string) => {
  let roomList = getFavoriteRooms();
  if (roomList.includes(roomId)) {
    roomList = roomList.filter(id => id !== roomId);
  }
  roomList.unshift(roomId);
  if (roomList.length > 10) {
    roomList.pop();
  }
  localStorage.setItem('favoriteRooms', JSON.stringify(roomList));
}

export const getFavoriteRooms = () : string[] => {
  const stored = localStorage.getItem('favoriteRooms');
  let roomList: string[] = [];
  if (stored != null) {
    roomList = JSON.parse(stored);
  }
  return roomList;
}
