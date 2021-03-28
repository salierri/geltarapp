import Express from 'express';
import { Room } from '../models/Room';
import { Session } from '../models/Session';
import bcrypt from 'bcrypt';

const router = Express.Router();

router.post('/:roomId', async (req, res) => {
  const roomId = req.params.roomId;
  const room = await Room.findOne({ _id: roomId });
  const pass: string = req.body.password;
  const isMaster: boolean = await bcrypt.compare(pass, room?.masterPassword ?? '');
  const isUser: boolean = await bcrypt.compare(pass, room?.password ?? '');
  if (isMaster) {
    const newSession = await new Session({ room: roomId, master: true }).save();
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Cookie');
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.cookie('X-Server-Auth-Token', newSession._id, { sameSite: 'lax', maxAge: 259200000, httpOnly: true });
    res.send(JSON.stringify({ room: roomId, session: newSession._id, master: true }));
  } else if (isUser) {
    const newSession = await new Session({ room: roomId, master: false }).save();
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Cookie');
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.cookie('X-Server-Auth-Token', newSession._id, { sameSite: 'lax', maxAge: 259200000, httpOnly: true });
    res.send(JSON.stringify({ room: roomId, session: newSession._id , master: false }));
  } else {
    res.sendStatus(401);
  }
});

export default router;
