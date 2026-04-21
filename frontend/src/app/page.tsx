"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QuestionCard } from "@/components/QuestionCard";
import { Question } from "@/types";
import { questionsApi } from "@/lib/api";
import Link from "next/link";

export default function HomePage() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [count, setCount] = useState(0);

  const loadQuestion = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await questionsApi.getRandom();
      setQuestion(res.data.data);
      setCount((c) => c + 1);
    } catch {
      setError("Não foi possível carregar a pergunta. Verifique se o servidor está rodando.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuestion();
  }, [loadQuestion]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-10 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl mb-3"
          >
            🤔
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-black mb-2"
          >
            Escolha Difícil
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-indigo-100 text-base md:text-lg"
          >
            A ou B? Você decide — e vê o que todo mundo prefere.
          </motion.p>
          {count > 1 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-indigo-200 text-sm mt-2"
            >
              {count - 1} {count - 1 === 1 ? "pergunta" : "perguntas"} respondida{count - 1 === 1 ? "" : "s"} nessa sessão
            </motion.p>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 py-8 px-4 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 gap-4"
              >
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                <p className="text-gray-500 dark:text-gray-400">Carregando pergunta...</p>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="card p-8 text-center"
              >
                <div className="text-5xl mb-4">😕</div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                <button onClick={loadQuestion} className="btn-primary mx-auto">
                  Tentar novamente
                </button>
              </motion.div>
            ) : question ? (
              <QuestionCard
                key={question.id}
                question={question}
                onNext={loadQuestion}
                onVoted={(updated) => setQuestion(updated)}
              />
            ) : null}
          </AnimatePresence>

          {/* Links extras */}
          {!loading && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 flex flex-wrap justify-center gap-4 text-sm"
            >
              <Link
                href="/ranking"
                className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                🏆 Ver ranking
              </Link>
              <Link
                href="/create"
                className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                ✏️ Criar pergunta
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
