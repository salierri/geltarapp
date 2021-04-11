import { LogEntry } from '../models/Log';
import { getActiveRooms, getConnectionCount } from '../socket';

const traficLogger = () => {
  new LogEntry({
    name: 'connections',
    value: getConnectionCount(),
    time: Date.now(),
  }).save();

  new LogEntry({
    name: 'activeRooms',
    value: getActiveRooms(),
    time: Date.now(),
  }).save();
};

export default traficLogger;
