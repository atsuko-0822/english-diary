"use client";

import { useState } from "react";
import { speak } from "@/lib/speech";

export function ShadowStep({
  sentences,
  onNext,
}: {
  sentences: string[];
  onNext: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [rate, setRate] = useState(0.8);
  const sentence = sentences[index];

  return (
    <section className="space-y-4">
      <p className="text-sm opacity-70">
        お手本を聞いて、少し遅れて同じように声に出しましょう（{index + 1} / {sentences.length}）
      </p>
      <p className="rounded-lg border border-stone-300 dark:border-stone-700 p-4 text-xl">
        {sentence}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <button
          className="rounded-lg bg-emerald-700 px-5 py-2 text-white"
          onClick={() => speak(sentence, rate)}
        >
          ▶ 再生
        </button>
        {[0.8, 1].map((r) => (
          <button
            key={r}
            className={`rounded-lg border px-3 py-2 text-sm ${rate === r ? "border-emerald-700 text-emerald-700" : "border-stone-300 dark:border-stone-700"}`}
            onClick={() => setRate(r)}
          >
            {r}倍
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <button
          className="rounded-lg border border-stone-300 dark:border-stone-700 px-4 py-2 disabled:opacity-40"
          disabled={index === 0}
          onClick={() => setIndex(index - 1)}
        >
          前の文
        </button>
        {index < sentences.length - 1 ? (
          <button
            className="rounded-lg border border-stone-300 dark:border-stone-700 px-4 py-2"
            onClick={() => setIndex(index + 1)}
          >
            次の文
          </button>
        ) : (
          <button
            className="rounded-lg bg-emerald-700 px-5 py-2 text-white"
            onClick={onNext}
          >
            音読チェックへ
          </button>
        )}
      </div>
    </section>
  );
}
