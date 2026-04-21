"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Question } from "@/types";
import { votesApi } from "@/lib/api";
import { VoteResults } from "./VoteResults";

interface Props {
  question: Question;
  onNext: () => void;
  onVoted?: (updated: Question) => void;
}

export function QuestionCard({ question, onNext, onVoted }: Props) {
  const [voted, setVoted] = useState<"A" | "B" | null>(
    question.userVote as "A" | "B" | null
  );
  const [stats, setStats] = useState({
    votesA: question.votesA,
    votesB: question.votesB,
    totalVotes: question.totalVotes,
    percentA: question.percentA,
    percentB: question.percentB,
  });
  const [loading, setLoading] = useState<"A" | "B" | null>(null);
  const [error, setError] = useState("");

  const hasVoted = voted !== null;

  async function handleVote(choice: "A" | "B") {
    if (hasVoted || loading) return;
    setLoading(choice);
    setError("");

    try {
      const res = await votesApi.cast(question.id, choice);
      const { stats: newStats } = res.data.data;
      setStats(newStats);
      setVoted(choice);
      onVoted?.({ ...question, ...newStats, userVote: choice });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg || "Erro ao votar. Tente novamente.");
      if (msg?.includes("já votou")) {
        setVoted(question.userVote as "A" | "B");
      }
    } finally {
      setLoading(null);
    }
  }

  function handleShare() {
    const text = `"${question.text}" — Você votaria em A (${question.optionA}) ou B (${question.optionB})? Jogue em Escolha Difícil!`;
    if (navigator.share) {
      navigator.share({ title: "Escolha Difícil", text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(text);
      alert("Link copiado para a área de transferência!");
    }
  }

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Badge categoria */}
      <div className="flex justify-center mb-4">
        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-full uppercase tracking-wide">
          {question.category}
        </span>
      </div>

      {/* Pergunta */}
      <div className="card p-6 md:p-8 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-center text-gray-900 dark:text-gray-100 leading-tight mb-2">
          {question.text}
        </h2>
        {!hasVoted && (
          <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-2">
            {question.totalVotes} {question.totalVotes === 1 ? "voto" : "votos"} até agora
          </p>
        )}
      </div>

      {/* Botões de voto */}
      <AnimatePresence mode="wait">
        {!hasVoted ? (
          <motion.div
            key="voting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 gap-4 mb-4"
          >
            {/* Opção A */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleVote("A")}
              disabled={!!loading}
              className="relative flex flex-col items-center justify-center gap-3 p-6 md:p-8 rounded-2xl
                bg-gradient-to-br from-indigo-500 to-indigo-600
                hover:from-indigo-400 hover:to-indigo-500
                text-white font-bold shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40
                transition-all duration-200 min-h-[140px] md:min-h-[160px]
                disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading === "A" && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-indigo-600/50">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <span className="text-4xl font-black opacity-30">A</span>
              <span className="text-center text-sm md:text-base leading-tight">
                {question.optionA}
              </span>
            </motion.button>

            {/* Opção B */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleVote("B")}
              disabled={!!loading}
              className="relative flex flex-col items-center justify-center gap-3 p-6 md:p-8 rounded-2xl
                bg-gradient-to-br from-pink-500 to-rose-600
                hover:from-pink-400 hover:to-rose-500
                text-white font-bold shadow-lg shadow-pink-200 dark:shadow-pink-900/40
                transition-all duration-200 min-h-[140px] md:min-h-[160px]
                disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading === "B" && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-rose-600/50">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <span className="text-4xl font-black opacity-30">B</span>
              <span className="text-center text-sm md:text-base leading-tight">
                {question.optionB}
              </span>
            </motion.button>
          </motion.div>
        ) : (
          <VoteResults
            question={question}
            stats={stats}
            userVote={voted}
          />
        )}
      </AnimatePresence>

      {/* Erro */}
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-red-500 mb-4"
        >
          {error}
        </motion.p>
      )}

      {/* Ações pós-voto */}
      {hasVoted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex gap-3 justify-center"
        >
          <button
            onClick={handleShare}
            className="btn-secondary text-sm gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Compartilhar
          </button>
          <button
            onClick={onNext}
            className="btn-primary text-sm"
          >
            Próxima pergunta
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
