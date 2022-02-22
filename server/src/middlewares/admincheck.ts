import config from 'config';
import { NextFunction, Request, Response } from "express";
import * as Logger from '../logger';

export default (req: Request, res: Response, next: NextFunction) => {
  const adminpass: string = req.cookies['X-Admin-Pass'];
  if (adminpass === config.get('admin_pass')) {
    next();
    Logger.info('Admin authorized.');
  } else {
    res.sendStatus(401);
    Logger.warn('Admin unauthorized.');
  }
}
