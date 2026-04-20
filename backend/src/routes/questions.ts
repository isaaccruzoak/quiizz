import { Router } from "express";
import { body } from "express-validator";
import {
  getRandom,
  getById,
  getTrending,
  getRanking,
  create,
  getUserHistory,
} from "../controllers/questionController";
import { authenticate, optionalAuth } from "../middlewares/auth";
import { validateRequest } from "../middlewares/validation";

const router = Router();

router.get("/random", optionalAuth, getRandom);
router.get("/trending", optionalAuth, getTrending);
router.get("/ranking", optionalAuth, getRanking);
router.get("/history", authenticate, getUserHistory);
router.get("/:id", optionalAuth, getById);

router.post(
  "/",
  optionalAuth,
  [
    body("text").isLength({ min: 10, max: 300 }).withMessage("Pergunta deve ter 10-300 caracteres."),
    body("optionA").isLength({ min: 2, max: 100 }).withMessage("Opção A deve ter 2-100 caracteres."),
    body("optionB").isLength({ min: 2, max: 100 }).withMessage("Opção B deve ter 2-100 caracteres."),
    validateRequest,
  ],
  create
);

export default router;
