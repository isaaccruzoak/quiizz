import { Response } from "express";
import * as questionService from "../services/questionService";
import { success, error } from "../utils/response";
import { AuthRequest } from "../types";

export async function getRandom(req: AuthRequest, res: Response) {
  try {
    const question = await questionService.getRandomQuestion(req.user?.userId);
    return success(res, question);
  } catch (err: unknown) {
    return error(res, (err as Error).message, 404);
  }
}

export async function getById(req: AuthRequest, res: Response) {
  try {
    const question = await questionService.getQuestionById(req.params.id, req.user?.userId);
    return success(res, question);
  } catch (err: unknown) {
    return error(res, (err as Error).message, 404);
  }
}

export async function getTrending(req: AuthRequest, res: Response) {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const questions = await questionService.getTrendingQuestions(limit, req.user?.userId);
    return success(res, questions);
  } catch (err: unknown) {
    return error(res, (err as Error).message);
  }
}

export async function getRanking(req: AuthRequest, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await questionService.getRankingQuestions(page, limit, req.user?.userId);
    return success(res, result);
  } catch (err: unknown) {
    return error(res, (err as Error).message);
  }
}

export async function create(req: AuthRequest, res: Response) {
  try {
    const { text, optionA, optionB, category } = req.body;
    const question = await questionService.createQuestion(
      text,
      optionA,
      optionB,
      category || "geral",
      req.user?.userId
    );
    return success(res, question, 201);
  } catch (err: unknown) {
    return error(res, (err as Error).message);
  }
}

export async function getUserHistory(req: AuthRequest, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await questionService.getUserHistory(req.user!.userId, page, limit);
    return success(res, result);
  } catch (err: unknown) {
    return error(res, (err as Error).message);
  }
}
