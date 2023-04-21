// express
import { Request, Response, NextFunction } from "express";

// dotenv
import dotenv from "dotenv";
dotenv.config();

// my custom middleware for checking the token
// (token is just a pre-generated string and works like API Keys)

const checkToken = (req: Request, res: Response, next: NextFunction) => {
  let token;
  if (req.body?.token) token = req.body.token;
  else token = req.query.token;
  if (token !== process.env.TOKEN)
    return res.status(403).json!({
      status: "fail",
      message: "access forbidden",
    });
  else next();
};

export default checkToken;
