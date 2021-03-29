import Express from 'express';
import mongoose from 'mongoose';
import roomCheck from '../middlewares/roomCheck';
import { Category } from '../models/Category';
import { Preset } from '../models/Preset';

const router = Express.Router();

router.use(roomCheck);

router.get('/', async (req, res) => {
  const roomId : any = req.roomId;
  const categories = await Category.find({ room: roomId });
  res.send(categories);
});

router.post('/', async (req, res) => {
  const categoryDoc = req.body;
  categoryDoc.room = req.roomId;
  categoryDoc.template = false;
  const newCategory = new Category(categoryDoc);
  newCategory.save()
    .catch((err) => {
      res.status(400).send(err.message);
    })
    .then(() => {
      res.sendStatus(200);
    });
});

router.put('/:categoryId', (req, res) => {
  Category.updateOne({ _id: req.params.categoryId }, req.body)
    .catch((err) => {
      res.status(400).send(err.message);
    })
    .then(() => {
      res.sendStatus(200);
    });
});

router.delete('/:categoryId', (req, res) => {
  const { categoryId } = req.params;
  Promise.all([
    Category.deleteOne({ _id: categoryId }),
    Preset.deleteMany({ category: categoryId }),
  ])
    .catch((err) => {
      res.status(400).send(err.message);
    })
    .then(() => {
      res.sendStatus(200);
    });
});

export default router;
