"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { questionsApi } from "@/lib/api";

const CATEGORIES = [
  "geral", "dinheiro", "vida", "trabalho", "fantasia",
  "tecnologia", "existencial", "habilidades", "dilemas", "estilo de vida",
];

export default function CreatePage() {
  const router = useRouter();
  const [form, setForm] = useState({ text: "", optionA: "", optionB: "", category: "geral" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const update = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await questionsApi.create(form);
      setSuccess(true);
      setTimeout(() => router.push("/"), 2000);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg || "Erro ao criar pergunta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-950">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Pergunta criada!
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Redirecionando para o jogo...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-10 px-4 bg-gray-50 dark:bg-gray-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto"
      >
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">✏️</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Criar pergunta</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Crie um dilema e veja o que as pessoas escolhem
          </p>
        </div>

        <div className="card p-8">
          {/* Preview */}
          {(form.text || form.optionA || form.optionB) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700"
            >
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
                Pré-visualização
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">
                {form.text || "Sua pergunta aparece aqui..."}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-center">
                  <span className="text-xs font-black text-indigo-300 block">A</span>
                  <span className="text-xs text-indigo-700 dark:text-indigo-300">
                    {form.optionA || "Opção A"}
                  </span>
                </div>
                <div className="p-3 bg-pink-50 dark:bg-pink-900/30 rounded-lg text-center">
                  <span className="text-xs font-black text-pink-300 block">B</span>
                  <span className="text-xs text-pink-700 dark:text-pink-300">
                    {form.optionB || "Opção B"}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                A pergunta difícil *
              </label>
              <textarea
                value={form.text}
                onChange={update("text")}
                className="input resize-none"
                placeholder="Ex: Você prefere ser rico e infeliz ou pobre e feliz?"
                rows={3}
                maxLength={300}
                minLength={10}
                required
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{form.text.length}/300</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Opção A *
                </label>
                <input
                  type="text"
                  value={form.optionA}
                  onChange={update("optionA")}
                  className="input border-indigo-200 dark:border-indigo-800 focus:ring-indigo-500"
                  placeholder="Primeira opção"
                  maxLength={100}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Opção B *
                </label>
                <input
                  type="text"
                  value={form.optionB}
                  onChange={update("optionB")}
                  className="input border-pink-200 dark:border-pink-800 focus:ring-pink-500"
                  placeholder="Segunda opção"
                  maxLength={100}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Categoria
              </label>
              <select value={form.category} onChange={update("category")} className="input">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Publicando...
                </>
              ) : (
                <>✨ Publicar pergunta</>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
