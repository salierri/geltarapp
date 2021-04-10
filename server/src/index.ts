import 'dotenv/config';
import Express from 'express';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import './socket';
import mp3upload from './routes/mp3upload';
import preset from './routes/preset';
import category from './routes/category';
import room from './routes/room';
import auth from './routes/auth';
import admin from './routes/admin';

const app = Express();

if (!process.env.MONGODB_URL) {
  console.error('MongoDB URL not set!');
} else {
  mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
}

app.use(fileUpload({
  createParentPath: true,
}));

var corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
}

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(Express.static('./uploads'));
app.use('/mp3', mp3upload);
app.use('/presets', preset);
app.use('/categories', category);
app.use('/rooms', room);
app.use('/auth', auth);
app.use('/admin', admin);

const port = process.env.HTTP_PORT;

app.listen(port, () => {
  console.log(`App is listening on port ${port}.`);
});
