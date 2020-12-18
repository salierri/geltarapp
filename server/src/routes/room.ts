import Express from 'express';
import { Room } from '../models/Room';

const router = Express.Router();

router.get('/', async (_, res) => {
  const rooms = await Room.find({});
  res.send(rooms);
});

router.post('/', async (req, res) => {
  const newRoom = new Room(req.body);
  newRoom.save()
    .catch((err) => {
      res.status(400).send(err.message);
    })
    .then(() => {
      res.sendStatus(200);
    });
});

router.put('/:roomId', (req, res) => {
  Room.updateOne({ _id: req.params.roomId }, req.body)
    .catch((err) => {
      res.status(400).send(err.message);
    })
    .then(() => {
      res.sendStatus(200);
    });
});

router.delete('/:roomId', (req, res) => {
  const { roomId } = req.params;
  Room.deleteOne({ _id: roomId })
    .catch((err) => {
      res.status(400).send(err.message);
    })
    .then(() => {
      res.sendStatus(200);
    });
});

export default router;
