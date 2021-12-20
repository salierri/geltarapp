import Express from 'express';
import { Room } from '../models/Room';
import bcrypt from 'bcrypt';
import { Category, CategoryDocument } from '../models/Category';
import { Preset, PresetDocument } from '../models/Preset';

const router = Express.Router();

router.get('/', async (_, res) => {
  const rooms = await Room.find({}, 'name visibility').sort({ createdAt: -1 }).limit(15);
  res.send(rooms);
});

router.get('/:roomId', async (req, res) => {
  const room = await Room.findOne({ _id: req.params.roomId }, 'name visibility');
  res.send(room);
});

router.post('/', async (req, res) => {
  const newRoom = new Room(req.body);
  newRoom.visibility = 'password';
  newRoom.password = await bcrypt.hash(req.body.password, 4);
  newRoom.masterPassword = await bcrypt.hash(req.body.masterPassword, 4);
  const includePresets = req.body.includePresets === 'include';
  if (newRoom.name.length > 64) {
    newRoom.name = newRoom.name.substring(0, 64);
  }
  newRoom.save()
    .catch((err) => {
      res.status(400).send(err.message);
    })
    .then(async (doc) => {
      if (doc) {
        if (includePresets) {
          let categories = await Category.find({ template: true });
          let presets = await Preset.find().where('_id').in(categories.map(cat => cat._id)).exec();
          categories = categories.map<CategoryDocument>((categoryDoc) => {
            delete categoryDoc._id;
            categoryDoc.template = false;
            categoryDoc.wasTemplate = true;
            return categoryDoc;
          });
          await Category.create(categories);
          presets = presets.map<PresetDocument>((presetDoc) => {
            delete presetDoc._id;
            return presetDoc;
          });
          await Preset.create(presets);
        } else {
          res.send(JSON.stringify({ _id: doc._id }));
        }
      } else {
        res.status(400).send("Unspecified error");
      }
    });
});

router.post('/details', async (req, res) => {
  const ids: string[] = req.body.rooms;
  const rooms = await Room.find().where('_id').in(ids).select('name visibility').exec();
  rooms.sort((a, b) => ids.indexOf(a._id.toString()) - ids.indexOf(b._id.toString()));
  res.send(rooms);
});

export default router;
