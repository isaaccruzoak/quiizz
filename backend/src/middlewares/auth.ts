import { Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { error } from "../utils/response";
import { AuthRequest } from "../types";

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return error(res, "Token de autenticação não fornecido.", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    req.user = verifyToken(token);
    return next();
  } catch {
    return error(res, "Token inválido ou expirado.", 401);
  }
}

export function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      req.user = verifyToken(token);
    } catch {
      // token inválido ignorado — usuário anônimo
    }
  }

  return next();
}
