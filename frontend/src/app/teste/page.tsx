"use client";
import { useEffect, useState } from "react";

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

      try {
        const res = await fetch(`${url}/rest/v1/questions?select=count&is_active=eq.true`, {
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
          },
        });
        const data = await res.json();
        setResultado(`✅ Conexão OK!\nStatus: ${res.status}\nResposta: ${JSON.stringify(data)}\n\nURL: ${url}\nKEY: ${key.slice(0, 20)}...`);
      } catch (e: unknown) {
        setResultado(`❌ Erro de conexão: ${e instanceof Error ? e.message : String(e)}`);
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
