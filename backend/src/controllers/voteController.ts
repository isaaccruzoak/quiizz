import { Response } from "express";
import * as voteService from "../services/voteService";
import { success, error } from "../utils/response";
import { AuthRequest } from "../types";

export async function vote(req: AuthRequest, res: Response) {
  try {
    const { questionId, choice } = req.body;

    if (!["A", "B"].includes(choice)) {
      return error(res, "Escolha inválida. Use A ou B.");
    }

    const result = await voteService.castVote(questionId, choice, req.user?.userId);
    return success(res, result, 201);
  } catch (err: unknown) {
    return error(res, (err as Error).message);
  }
}
