"use client";

import { motion } from "framer-motion";
import { Question } from "@/types";

interface Stats {
  votesA: number;
  votesB: number;
  totalVotes: number;
  percentA: number;
  percentB: number;
}

interface Props {
  question: Question;
  stats: Stats;
  userVote: "A" | "B";
}

export function VoteResults({ question, stats, userVote }: Props) {
  const winner = stats.percentA > stats.percentB ? "A" : stats.percentB > stats.percentA ? "B" : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="card p-6 mb-6"
    >
      {/* Header com resultado */}
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="text-4xl mb-2"
        >
          {userVote === winner ? "🎉" : winner === null ? "🤝" : "😮"}
        </motion.div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Você votou em{" "}
          <span className={`font-bold ${userVote === "A" ? "text-indigo-600 dark:text-indigo-400" : "text-pink-600 dark:text-pink-400"}`}>
            opção {userVote}
          </span>
          {userVote === winner ? " — a mais popular!" : winner === null ? " — empate!" : " — minoria aqui!"}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {stats.totalVotes} {stats.totalVotes === 1 ? "voto" : "votos"} no total
        </p>
      </div>

      {/* Opção A */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-xs font-black flex items-center justify-center">
              A
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[200px] truncate">
              {question.optionA}
            </span>
            {userVote === "A" && (
              <span className="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-medium">
                Seu voto
              </span>
            )}
          </div>
          <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
            {stats.percentA}%
          </span>
        </div>
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.percentA}%` }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full"
          />
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {stats.votesA} {stats.votesA === 1 ? "voto" : "votos"}
        </p>
      </div>

      {/* Opção B */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 text-xs font-black flex items-center justify-center">
              B
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[200px] truncate">
              {question.optionB}
            </span>
            {userVote === "B" && (
              <span className="text-xs bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 px-2 py-0.5 rounded-full font-medium">
                Seu voto
              </span>
            )}
          </div>
          <span className="text-lg font-bold text-pink-600 dark:text-pink-400">
            {stats.percentB}%
          </span>
        </div>
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.percentB}%` }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-pink-400 to-rose-600 rounded-full"
          />
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {stats.votesB} {stats.votesB === 1 ? "voto" : "votos"}
        </p>
      </div>
    </motion.div>
  );
}
