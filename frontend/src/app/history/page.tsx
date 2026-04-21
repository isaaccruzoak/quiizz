"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { questionsApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { HistoryItem } from "@/types";
import Link from "next/link";

function HistoryCard({ item, index }: { item: HistoryItem; index: number }) {
  const { question, choice, votedAt } = item;
  const isA = choice === "A";
  const option = isA ? question.optionA : question.optionB;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="card p-5"
    >
      <div className="flex items-start gap-3 mb-4">
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black text-white ${
            isA
              ? "bg-gradient-to-br from-indigo-500 to-indigo-600"
              : "bg-gradient-to-br from-pink-500 to-rose-600"
          }`}
        >
          {choice}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 leading-snug">
            {question.text}
          </p>
          <p className={`text-xs mt-1 font-medium ${isA ? "text-indigo-600 dark:text-indigo-400" : "text-pink-600 dark:text-pink-400"}`}>
            Você escolheu: {option}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {new Date(votedAt).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      {/* Mini barras */}
      <div className="space-y-1.5">
        <div>
          <div className="flex justify-between text-xs mb-0.5">
            <span className={`font-medium ${choice === "A" ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400"}`}>
              A {choice === "A" && "← seu voto"}
            </span>
            <span className={`font-bold ${choice === "A" ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400"}`}>
              {question.percentA}%
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full transition-all duration-700"
              style={{ width: `${question.percentA}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-0.5">
            <span className={`font-medium ${choice === "B" ? "text-pink-600 dark:text-pink-400" : "text-gray-400"}`}>
              B {choice === "B" && "← seu voto"}
            </span>
            <span className={`font-bold ${choice === "B" ? "text-pink-600 dark:text-pink-400" : "text-gray-400"}`}>
              {question.percentB}%
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-400 to-rose-600 rounded-full transition-all duration-700"
              style={{ width: `${question.percentB}%` }}
            />
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-right">
        {question.totalVotes} votos totais
      </p>
    </motion.div>
  );
}

export default function HistoryPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    async function load() {
      setLoading(true);
      try {
        const res = await questionsApi.getHistory(page);
        const { data, totalPages: tp, total: t } = res.data.data;
        setHistory(data);
        setTotalPages(tp);
        setTotal(t);
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [isAuthenticated, router, page]);

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-4xl mb-3">📋</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Seu histórico</h1>
          {total > 0 && (
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {total} {total === 1 ? "pergunta respondida" : "perguntas respondidas"}
            </p>
          )}
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : history.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card p-10 text-center"
          >
            <div className="text-5xl mb-4">🤔</div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Você ainda não respondeu nenhuma pergunta.
            </p>
            <Link href="/" className="btn-primary inline-flex">
              Começar a jogar
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="space-y-4">
              {history.map((item, i) => (
                <HistoryCard key={item.voteId} item={item} index={i} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-secondary text-sm disabled:opacity-40"
                >
                  ← Anterior
                </button>
                <span className="flex items-center text-sm text-gray-500 px-4">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn-secondary text-sm disabled:opacity-40"
                >
                  Próxima →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
