import { prisma } from "../lib/prisma";
import { QuestionWithStats } from "../types";

function calcStats(votes: { choice: string }[], userVoteChoice?: string | null): Omit<QuestionWithStats, "id" | "text" | "optionA" | "optionB" | "category" | "createdAt" | "createdBy"> {
  const votesA = votes.filter((v) => v.choice === "A").length;
  const votesB = votes.filter((v) => v.choice === "B").length;
  const total = votesA + votesB;
  return {
    votesA,
    votesB,
    totalVotes: total,
    percentA: total === 0 ? 50 : Math.round((votesA / total) * 100),
    percentB: total === 0 ? 50 : Math.round((votesB / total) * 100),
    userVote: userVoteChoice ?? null,
  };
}

export async function getRandomQuestion(userId?: string): Promise<QuestionWithStats> {
  const count = await prisma.question.count({ where: { isActive: true } });
  if (count === 0) throw new Error("Nenhuma pergunta disponível.");

  const skip = Math.floor(Math.random() * count);
  const question = await prisma.question.findFirst({
    where: { isActive: true },
    skip,
    include: { votes: { select: { choice: true, userId: true } } },
  });

  if (!question) throw new Error("Pergunta não encontrada.");

  const userVote = userId
    ? question.votes.find((v) => v.userId === userId)?.choice ?? null
    : null;

  return { ...question, ...calcStats(question.votes, userVote) };
}

export async function getQuestionById(id: string, userId?: string): Promise<QuestionWithStats> {
  const question = await prisma.question.findUnique({
    where: { id },
    include: { votes: { select: { choice: true, userId: true } } },
  });

  if (!question) throw new Error("Pergunta não encontrada.");

  const userVote = userId
    ? question.votes.find((v) => v.userId === userId)?.choice ?? null
    : null;

  return { ...question, ...calcStats(question.votes, userVote) };
}

export async function getTrendingQuestions(limit = 10, userId?: string): Promise<QuestionWithStats[]> {
  const questions = await prisma.question.findMany({
    where: { isActive: true },
    include: { votes: { select: { choice: true, userId: true } } },
    orderBy: { votes: { _count: "desc" } },
    take: limit,
  });

  return questions.map((q) => {
    const userVote = userId ? q.votes.find((v) => v.userId === userId)?.choice ?? null : null;
    return { ...q, ...calcStats(q.votes, userVote) };
  });
}

export async function getRankingQuestions(page = 1, limit = 10, userId?: string) {
  const skip = (page - 1) * limit;

  const [questions, total] = await prisma.$transaction([
    prisma.question.findMany({
      where: { isActive: true },
      include: { votes: { select: { choice: true, userId: true } } },
      orderBy: { votes: { _count: "desc" } },
      skip,
      take: limit,
    }),
    prisma.question.count({ where: { isActive: true } }),
  ]);

  const data = questions.map((q) => {
    const userVote = userId ? q.votes.find((v) => v.userId === userId)?.choice ?? null : null;
    return { ...q, ...calcStats(q.votes, userVote) };
  });

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function createQuestion(
  text: string,
  optionA: string,
  optionB: string,
  category: string,
  userId?: string
): Promise<QuestionWithStats> {
  const question = await prisma.question.create({
    data: { text, optionA, optionB, category, createdBy: userId ?? null },
    include: { votes: { select: { choice: true, userId: true } } },
  });

  return { ...question, ...calcStats([]) };
}

export async function getUserHistory(userId: string, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [votes, total] = await prisma.$transaction([
    prisma.vote.findMany({
      where: { userId },
      include: {
        question: {
          include: { votes: { select: { choice: true, userId: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.vote.count({ where: { userId } }),
  ]);

  const data = votes.map((v) => ({
    voteId: v.id,
    choice: v.choice,
    votedAt: v.createdAt,
    question: { ...v.question, ...calcStats(v.question.votes, v.choice) },
  }));

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}
