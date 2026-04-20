import { Request, Response } from "express";
import * as authService from "../services/authService";
import { success, error } from "../utils/response";
import { AuthRequest } from "../types";

export async function register(req: Request, res: Response) {
  try {
    const { email, username, password } = req.body;
    const result = await authService.register(email, username, password);
    return success(res, result, 201);
  } catch (err: unknown) {
    return error(res, (err as Error).message);
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { identifier, password } = req.body;
    const result = await authService.login(identifier, password);
    return success(res, result);
  } catch (err: unknown) {
    return error(res, (err as Error).message, 401);
  }
}

export async function getProfile(req: AuthRequest, res: Response) {
  try {
    const user = await authService.getProfile(req.user!.userId);
    return success(res, user);
  } catch (err: unknown) {
    return error(res, (err as Error).message, 404);
  }
}
