import Express from 'express';
import { Room } from '../models/Room';
import { Session } from '../models/Session';

const router = Express.Router();

router.post('/:roomId', async (req, res) => {
  const roomId = req.params.roomId;
  const room = await Room.findOne({ _id: roomId });
  const pass: string = req.body.password;
  if (room?.password == pass) {
    const newSession = await new Session({ room: roomId }).save();
    res.send(JSON.stringify({ room: roomId, session: newSession._id }));
  } else {
    res.sendStatus(401);
  }
});
