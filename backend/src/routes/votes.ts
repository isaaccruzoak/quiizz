import { Router } from "express";
import { body } from "express-validator";
import { vote } from "../controllers/voteController";
import { optionalAuth } from "../middlewares/auth";
import { validateRequest } from "../middlewares/validation";

const router = Router();

router.post(
  "/",
  optionalAuth,
  [
    body("questionId").isUUID().withMessage("ID de pergunta inválido."),
    body("choice").isIn(["A", "B"]).withMessage("Escolha deve ser A ou B."),
    validateRequest,
  ],
  vote
);

export default router;
