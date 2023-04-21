// express
import { Request, Response, NextFunction } from "express";

// my custom middleware to add extra fields to json response

const addToJson = (fieldsToAdd: { [key: string]: any } = {}) => {
  const myMiddleWare = (_: Request, res: Response, next: NextFunction) => {
    res.json = (object) => {
      const returnArray = Object.keys(fieldsToAdd).map((key) => {
        return [
          key,
          fieldsToAdd[key] instanceof Function
            ? (fieldsToAdd[key] as Function)()
            : fieldsToAdd[key],
        ];
      });
      const returnObject = Object.fromEntries(returnArray);
      return res
        .setHeader("Content-Type", "application/json")
        .send(JSON.stringify(Object.assign(object, returnObject)));
    };
    next();
  };
  return myMiddleWare;
};

export default addToJson;
