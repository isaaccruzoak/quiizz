import { prisma } from "../lib/prisma";

export async function castVote(questionId: string, choice: "A" | "B", userId?: string) {
  const question = await prisma.question.findUnique({ where: { id: questionId } });
  if (!question) throw new Error("Pergunta não encontrada.");

  if (userId) {
    const existing = await prisma.vote.findUnique({
      where: { questionId_userId: { questionId, userId } },
    });
    if (existing) throw new Error("Você já votou nesta pergunta.");
  }

  const vote = await prisma.vote.create({
    data: { questionId, choice, userId: userId ?? null },
  });

  // retorna contagens atualizadas
  const [votesA, votesB] = await prisma.$transaction([
    prisma.vote.count({ where: { questionId, choice: "A" } }),
    prisma.vote.count({ where: { questionId, choice: "B" } }),
  ]);

  const total = votesA + votesB;

  return {
    vote,
    stats: {
      votesA,
      votesB,
      totalVotes: total,
      percentA: total === 0 ? 50 : Math.round((votesA / total) * 100),
      percentB: total === 0 ? 50 : Math.round((votesB / total) * 100),
    },
  };
}
