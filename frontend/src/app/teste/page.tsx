"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

export default function TestePage() {
  const [resultado, setResultado] = useState("Testando...");

  useEffect(() => {
    async function testar() {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!url || !key) {
        setResultado(`❌ Variáveis não configuradas!\nURL: "${url}"\nKEY: "${key}"`);
        return;
      }

      setResultado(`🔄 Variáveis OK!\nURL: ${url}\nKEY: ${key.slice(0, 25)}...\n\nConectando ao banco...`);

      try {
        const supabase = createClient(url, key);
        const { data, error, count } = await supabase
          .from("questions")
          .select("id, text", { count: "exact" })
          .limit(1);

        if (error) {
          setResultado(`❌ Erro do Supabase: ${error.message}\nCódigo: ${error.code}\n\nURL: ${url}`);
        } else {
          setResultado(`✅ TUDO OK!\nTotal de perguntas: ${count}\nPrimeira pergunta: "${data?.[0]?.text ?? "nenhuma"}"\n\nURL: ${url}`);
        }
      } catch (e: unknown) {
        setResultado(`❌ Erro inesperado: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
    testar();
  }, []);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Diagnóstico Supabase</h1>
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded whitespace-pre-wrap text-sm">
        {resultado}
      </pre>
    </div>
  );
}
