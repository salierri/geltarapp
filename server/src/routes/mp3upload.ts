import config from 'config';
import Express from 'express';
import { UploadedFile } from 'express-fileupload';
import * as crypto from 'crypto';
import { broadcastMessage } from '../socket';
import * as Logger from '../logger';

const router = Express.Router();

router.post('/upload', (req, res) => {
  if (!config.get('features_enabled.mp3_upload')) {
    res.sendStatus(503);
    Logger.warn('Mp3 upload denied by config.');
    return;
  }
  if (req.files && req.files.effect) {
    const originalFilename = (req.files.effect as UploadedFile).name;
    const fileName = crypto.randomBytes(20).toString('hex');
    (req.files.effect as UploadedFile).mv(`./uploads/${fileName}.mp3`)
      .then(() => {
        Logger.info(`Mp3 upload, original filename: ${originalFilename}, new filename: ${fileName}`);
        // TODO Update for rooms
        // broadcastMessage({ type: 'command', command: 'LoadMp3', role: 'ambience', param: `${fileName}.mp3` });
        res.sendStatus(200);
      })
      .catch((reason) => {
        Logger.error(`Mp3 upload failed: ${reason}`);
        res.sendStatus(500);
      });
  } else {
    Logger.error('Mp3 upload without mp3 file!');
    res.sendStatus(400);
  }
});

export default router;
