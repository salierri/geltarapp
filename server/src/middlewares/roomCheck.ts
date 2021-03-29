import { NextFunction, Request, Response } from "express";
import { Session } from "../models/Session";

export default (req: Request, res: Response, next: NextFunction) => {
  const sessionId: string = req.cookies['X-Auth-Token'];
  Session.findOne({ _id: sessionId }).then((session) => {
    if (session === null) {
      res.sendStatus(401);
    } else {
      req.roomId = session.room._id;
      next();
    }
  });
}