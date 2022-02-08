import { LogEntry } from '../models/Log';
import { getActiveRooms, getConnectionCount } from '../socket';
import * as Logger from '../logger';

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
  Logger.info('Traffic logging completed.');
};

export default traficLogger;
