import 'dotenv/config';
import Express from 'express';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import './socket';
import mp3upload from './routes/mp3upload';
import preset from './routes/preset';
import category from './routes/category';

const app = Express();

mongoose.connect('mongodb://localhost:27017/geltarapp', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(fileUpload({
  createParentPath: true,
}));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(Express.static('./uploads'));
app.use('/mp3', mp3upload);
app.use('/presets', preset);
app.use('/categories', category);

const port = process.env.HTTP_PORT;

app.listen(port, () => {
  console.log(`App is listening on port ${port}.`);
});
