// I know, I know, this is pretty scuffed, feel free to refactor :)
class RoomListUpdateChecker {
  subscribers: (() => void)[] = [];

  subscribe = (callback: () => void) => {
    this.subscribers.push(callback);
  };

  requestReload = () => {
    this.subscribers.forEach((subscriber) => {
      subscriber();
    });
  };
}

const roomListupdateChecker = new RoomListUpdateChecker();
export default roomListupdateChecker;
