import Express from 'express';
import { Category } from '../models/Category';

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
  Category.deleteOne({ _id: req.params.categoryId })
    .catch((err) => {
      res.status(400).send(err.message);
    })
    .then(() => {
      res.sendStatus(200);
    });
});

export default router;
