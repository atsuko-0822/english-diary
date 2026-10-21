"use client";

import { useState } from "react";
import { WriteStep } from "@/components/WriteStep";
import { CorrectionStep } from "@/components/CorrectionStep";
import { ShadowStep } from "@/components/ShadowStep";
import { ReadStep } from "@/components/ReadStep";
import type { CorrectionResult } from "@/lib/types";

type Step = "write" | "correction" | "shadow" | "read" | "done";

const STEP_LABELS: { step: Step; label: string }[] = [
  { step: "write", label: "書く" },
  { step: "correction", label: "添削" },
  { step: "shadow", label: "シャドーイング" },
  { step: "read", label: "英語で言う" },
];

export default function Home() {
  const [step, setStep] = useState<Step>("write");
  const [correction, setCorrection] = useState<CorrectionResult | null>(null);
  const sentences = correction?.sentences.map((s) => s.corrected) ?? [];
  const japanese = correction?.sentences.map((s) => s.japanese) ?? [];

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">English Diary</h1>
      <nav className="flex gap-2 text-sm">
        {STEP_LABELS.map(({ step: s, label }) => (
          <span
            key={s}
            className={`rounded-full px-3 py-1 ${s === step ? "bg-emerald-700 text-white" : "bg-stone-200 dark:bg-stone-800"}`}
          >
            {label}
          </span>
        ))}
      </nav>

      {step === "write" && (
        <WriteStep
          onCorrected={(result) => {
            setCorrection(result);
            setStep("correction");
          }}
        />
      )}
      {step === "correction" && correction && (
        <CorrectionStep result={correction} onNext={() => setStep("shadow")} />
      )}
      {step === "shadow" && (
        <ShadowStep sentences={sentences} onNext={() => setStep("read")} />
      )}
      {step === "read" && (
        <ReadStep sentences={sentences} japanese={japanese} onFinish={() => setStep("done")} />
      )}
      {step === "done" && (
        <section className="space-y-4">
          <p className="text-xl">今日の日記、全部の文を言えました。おつかれさまでした！</p>
          <button
            className="rounded-lg border border-stone-300 dark:border-stone-700 px-4 py-2"
            onClick={() => {
              setCorrection(null);
              setStep("write");
            }}
          >
            新しい日記を書く
          </button>
        </section>
      )}
    </main>
  );
}
