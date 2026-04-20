import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { error } from "../utils/response";

export function validateRequest(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return error(res, errors.array()[0].msg, 422);
  }
  return next();
}
