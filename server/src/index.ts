import config from 'config';
import Express from 'express';
import fileUpload from 'express-fileupload';
import schedule from 'node-schedule';
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
import traficLogger from './tasks/trafficlogger';
import * as Logger from './logger';

const app = Express();

mongoose.connect(config.get('mongodb.url'), { useNewUrlParser: true, useUnifiedTopology: true });

app.use(fileUpload({
  createParentPath: true,
}));

const corsOptions = {
  origin: config.get('frontend_url') as string,
  credentials: true,
};

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

const port: number = config.get('http_port');

app.listen(port, () => {
  Logger.info(`App is listening on port ${port}.`);
});

schedule.scheduleJob('*/30 * * * *', traficLogger);
