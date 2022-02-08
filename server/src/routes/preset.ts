import Express from 'express';
import roomCheck from '../middlewares/roomCheck';
import { Preset } from '../models/Preset';
import * as Logger from '../logger';

const router = Express.Router();

router.use(roomCheck);

router.get('/', async (req, res) => {
  const presets = await Preset.find().populate('category');
  res.send(presets);
});

router.post('/', async (req, res) => {
  const presetDoc = req.body;
  presetDoc.room = req.roomId;
  const newPreset = new Preset(presetDoc);
  newPreset.save()
    .catch((err) => {
      res.status(400).send(err.message);
      Logger.error(`Error during preset creation: ${err.message}`);
    })
    .then(() => {
      res.sendStatus(200);
      Logger.info(`New preset created: ${req.body.title}`);
    });
});

router.put('/:presetId', (req, res) => {
  Preset.updateOne({ _id: req.params.presetId, room: req.roomId }, req.body)
    .catch((err) => {
      res.status(400).send(err.message);
      Logger.error(`Error during preset update: ${err.message}`);
    })
    .then(() => {
      res.sendStatus(200);
    });
});

router.delete('/:presetId', (req, res) => {
  Preset.deleteOne({ _id: req.params.presetId, room: req.roomId })
    .catch((err) => {
      res.status(400).send(err.message);
      Logger.error(`Error during preset deletion: ${err.message}`);
    })
    .then(() => {
      res.sendStatus(200);
    });
});

export default router;
