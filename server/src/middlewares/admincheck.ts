import { NextFunction, Request, Response } from "express";

export default (req: Request, res: Response, next: NextFunction) => {
  const adminpass: string = req.cookies['X-Admin-Pass'];
  if (adminpass === process.env.ADMIN_PASS) {
    next();
  } else {
    res.sendStatus(401);
  }
}
