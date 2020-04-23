import Express from 'express';
import { Category } from '../models/Category';
import { Preset } from '../models/Preset';

const router = Express.Router();

router.get('/', async (_, res) => {
  const categories = await Category.find({});
  res.send(categories);
});

router.post('/', async (req, res) => {
  const newCategory = new Category(req.body);
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
