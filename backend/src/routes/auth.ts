import { Router } from "express";
import { body } from "express-validator";
import { register, login, getProfile } from "../controllers/authController";
import { authenticate } from "../middlewares/auth";
import { validateRequest } from "../middlewares/validation";

const router = Router();

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("E-mail inválido."),
    body("username")
      .isLength({ min: 3, max: 20 })
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage("Usuário deve ter 3-20 caracteres (letras, números e _)."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Senha deve ter no mínimo 6 caracteres."),
    validateRequest,
  ],
  register
);

router.post(
  "/login",
  [
    body("identifier").notEmpty().withMessage("E-mail ou usuário obrigatório."),
    body("password").notEmpty().withMessage("Senha obrigatória."),
    validateRequest,
  ],
  login
);

router.get("/profile", authenticate, getProfile);

export default router;
