import Express from 'express';
import { UploadedFile } from 'express-fileupload';
import * as crypto from 'crypto';
import { broadcastMessage } from '../socket';

const router = Express.Router();

router.post('/upload', (req, res) => {
    if(req.files?.effect) {
        const fileName = crypto.randomBytes(20).toString('hex');
        (req.files.effect as UploadedFile).mv(`./uploads/${fileName}.mp3`)
            .then(() => {
                console.log('Mp3 upload, original filename: ' +
                (req.files!.effect as UploadedFile).name +
                ', new filename: ' + fileName);
                broadcastMessage({type: 'command', command: 'LoadMp3', video: 'ambience', param: `${fileName}.mp3`});
            })
            .catch((reason) => {
                console.error('Mp3 upload failed: ' + reason);
            });
    } else {
        console.error('Mp3 upload without mp3 file!');
    }
});

export default router;
