"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { questionsApi } from "@/lib/api";
import { Question } from "@/types";
import Link from "next/link";

const MEDALS = ["🥇", "🥈", "🥉"];

function RankingItem({ question, index }: { question: Question; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card p-5 flex gap-4"
    >
      <div className="flex-shrink-0 w-10 text-center">
        {index < 3 ? (
          <span className="text-2xl">{MEDALS[index]}</span>
        ) : (
          <span className="text-lg font-bold text-gray-400 dark:text-gray-600">#{index + 1}</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug mb-3 line-clamp-2">
          {question.text}
        </p>

        <div className="space-y-2">
          {/* Barra A */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-indigo-600 dark:text-indigo-400 font-medium truncate max-w-[60%]">
                A: {question.optionA}
              </span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">{question.percentA}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${question.percentA}%` }}
                transition={{ duration: 0.8, delay: index * 0.05 + 0.3 }}
                className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full"
              />
            </div>
          </div>

          {/* Barra B */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-pink-600 dark:text-pink-400 font-medium truncate max-w-[60%]">
                B: {question.optionB}
              </span>
              <span className="text-pink-600 dark:text-pink-400 font-bold">{question.percentB}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${question.percentB}%` }}
                transition={{ duration: 0.8, delay: index * 0.05 + 0.4 }}
                className="h-full bg-gradient-to-r from-pink-400 to-rose-600 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 text-right">
        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
          {question.totalVotes.toLocaleString("pt-BR")}
        </span>
        <p className="text-xs text-gray-400 dark:text-gray-500">votos</p>
        <span className="inline-block mt-1 text-xs bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full">
          {question.category}
        </span>
      </div>
    </motion.div>
  );
}

export default function RankingPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [trending, setTrending] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tab, setTab] = useState<"ranking" | "trending">("ranking");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [rankRes, trendRes] = await Promise.all([
          questionsApi.getRanking(page),
          questionsApi.getTrending(5),
        ]);
        setQuestions(rankRes.data.data.data);
        setTotalPages(rankRes.data.data.totalPages);
        setTrending(trendRes.data.data);
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page]);

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-4xl mb-3">🏆</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Ranking de Perguntas
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            As questões mais votadas da plataforma
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6">
          <button
            onClick={() => setTab("ranking")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
              tab === "ranking"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            🏆 Top Geral
          </button>
          <button
            onClick={() => setTab("trending")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
              tab === "trending"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            🔥 Em Alta
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {tab === "ranking" && (
              <>
                <div className="space-y-3">
                  {questions.map((q, i) => (
                    <RankingItem key={q.id} question={q} index={(page - 1) * 10 + i} />
                  ))}
                </div>

                {/* Paginação */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="btn-secondary text-sm disabled:opacity-40"
                    >
                      ← Anterior
                    </button>
                    <span className="flex items-center text-sm text-gray-500 dark:text-gray-400 px-4">
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

            {tab === "trending" && (
              <div className="space-y-3">
                {trending.map((q, i) => (
                  <RankingItem key={q.id} question={q} index={i} />
                ))}
              </div>
            )}
          </>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 card p-6 text-center"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Quer ver sua pergunta aqui? Crie uma agora!
          </p>
          <Link href="/create" className="btn-primary inline-flex">
            ✏️ Criar pergunta
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
