import Express from 'express';
import { Preset } from '../models/Preset';

const router = Express.Router();

router.get('/', async (_, res) => {
  const presets = await Preset.find({}).populate('category');
  res.send(presets);
});

router.post('/', async (req, res) => {
  const newPreset = new Preset(req.body);
  newPreset.save()
    .catch((err) => {
      res.status(400).send(err.message);
    })
    .then(() => {
      res.sendStatus(200);
    });
});

router.put('/:presetId', (req, res) => {
  Preset.updateOne({ _id: req.params.presetId }, req.body)
    .catch((err) => {
      res.status(400).send(err.message);
    })
    .then(() => {
      res.sendStatus(200);
    });
});

router.delete('/:presetId', (req, res) => {
  Preset.deleteOne({ _id: req.params.presetId })
    .catch((err) => {
      res.status(400).send(err.message);
    })
    .then(() => {
      res.sendStatus(200);
    });
});

export default router;
