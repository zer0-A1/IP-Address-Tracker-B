// express
import { Request, Response, NextFunction } from "express";

// a little middleware to add 'X-Powered-By' header
const poweredBy = (_: Request, res: Response, next: NextFunction) => {
  res.setHeader(
    "X-Powered-By",
    "Node.js, Express.js, Vercel.com, a cup of coffee, and lots of love :)"
  );
  next();
};

export default poweredBy;
