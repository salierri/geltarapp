import Express from 'express';
import { Room } from '../models/Room';
import bcrypt from 'bcrypt';

const router = Express.Router();

router.get('/', async (_, res) => {
  const rooms = await Room.find({}, 'name visibility').sort({ createdAt: -1 });
  res.send(rooms);
});

router.get('/:roomId', async (req, res) => {
  const room = await Room.findOne({ _id: req.params.roomId }, 'name visibility');
  res.send(room);
});

router.post('/', async (req, res) => {
  const newRoom = new Room(req.body);
  newRoom.password = await bcrypt.hash(req.body.password, 4);
  newRoom.masterPassword = await bcrypt.hash(req.body.masterPassword, 4);
  newRoom.save()
    .catch((err) => {
      res.status(400).send(err.message);
    })
    .then(() => {
      res.sendStatus(200);
    });
});

export default router;
