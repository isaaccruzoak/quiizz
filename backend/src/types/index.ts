import { Request } from "express";

export interface AuthPayload {
  userId: string;
  email: string;
  username: string;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export interface QuestionWithStats {
  id: string;
  text: string;
  optionA: string;
  optionB: string;
  category: string;
  createdAt: Date;
  createdBy: string | null;
  votesA: number;
  votesB: number;
  totalVotes: number;
  percentA: number;
  percentB: number;
  userVote?: string | null;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}
