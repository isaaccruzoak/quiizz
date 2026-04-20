import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { signToken } from "../utils/jwt";

export async function register(email: string, username: string, password: string) {
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });

  if (existing) {
    if (existing.email === email) throw new Error("E-mail já cadastrado.");
    throw new Error("Nome de usuário já em uso.");
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, username, password: hashed },
    select: { id: true, email: true, username: true, createdAt: true },
  });

  const token = signToken({ userId: user.id, email: user.email, username: user.username });
  return { user, token };
}

export async function login(identifier: string, password: string) {
  const user = await prisma.user.findFirst({
    where: { OR: [{ email: identifier }, { username: identifier }] },
  });

  if (!user) throw new Error("Credenciais inválidas.");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Credenciais inválidas.");

  const token = signToken({ userId: user.id, email: user.email, username: user.username });
  return {
    user: { id: user.id, email: user.email, username: user.username, createdAt: user.createdAt },
    token,
  };
}

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      createdAt: true,
      _count: { select: { votes: true, questions: true } },
    },
  });

  if (!user) throw new Error("Usuário não encontrado.");
  return user;
}
