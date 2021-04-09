import Express from 'express';
import roomCheck from '../middlewares/roomCheck';
import { Preset } from '../models/Preset';

const router = Express.Router();

router.use(roomCheck);

router.get('/', async (req, res) => {
  const presets = await Preset.find({ room: req.roomId }).populate('category');
  res.send(presets);
});

router.post('/', async (req, res) => {
  const presetDoc = req.body;
  presetDoc.room = req.roomId;
  const newPreset = new Preset(presetDoc);
  newPreset.save()
    .catch((err) => {
      res.status(400).send(err.message);
    })
    .then(() => {
      res.sendStatus(200);
    });
});

router.put('/:presetId', (req, res) => {
  Preset.updateOne({ _id: req.params.presetId, room: req.roomId }, req.body)
    .catch((err) => {
      res.status(400).send(err.message);
    })
    .then(() => {
      res.sendStatus(200);
    });
});

router.delete('/:presetId', (req, res) => {
  Preset.deleteOne({ _id: req.params.presetId, room: req.roomId })
    .catch((err) => {
      res.status(400).send(err.message);
    })
    .then(() => {
      res.sendStatus(200);
    });
});

export default router;
