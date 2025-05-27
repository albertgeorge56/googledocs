import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

const validate = (req: Request, res: Response, next: NextFunction) => {
  const err = validationResult(req);
  if (!err.isEmpty) return void res.status(400).json(err.array());
  next();
};

export default validate;
