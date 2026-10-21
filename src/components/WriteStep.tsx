"use client";

import { useState } from "react";
import type { CorrectionResult } from "@/lib/types";

export function WriteStep({
  onCorrected,
}: {
  onCorrected: (result: CorrectionResult) => void;
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/correct", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "添削に失敗しました");
      onCorrected(data as CorrectionResult);
    } catch (e) {
      setError(e instanceof Error ? e.message : "添削に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-4">
      <p className="text-sm opacity-70">
        今日あったことを英語で3〜5文書いてみましょう。わからない単語は日本語のままでOKです。
      </p>
      <textarea
        className="w-full h-48 rounded-lg border border-stone-300 dark:border-stone-700 bg-transparent p-3 text-base"
        placeholder="I went to cafe with my friend. We talked about 転職."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        className="rounded-lg bg-emerald-700 px-5 py-2 text-white disabled:opacity-40"
        disabled={loading || !text.trim()}
        onClick={submit}
      >
        {loading ? "添削中…" : "添削する"}
      </button>
    </section>
  );
}
