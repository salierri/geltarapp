import Express from "express";
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import mp3upload from './routes/mp3upload';
import './socket';

const app = Express();

app.use(fileUpload({
    createParentPath: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(Express.static('./uploads'));
app.use('/mp3', mp3upload);

const port = process.env.PORT || 3001;

app.listen(port, () => {
        console.log(`App is listening on port ${port}.`);
    }
);
