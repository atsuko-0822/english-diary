"use client";

import { useRef, useState } from "react";
import { listen } from "@/lib/speech";
import { scoreReading, type WordResult } from "@/lib/score";

const PASS_SCORE = 80;

export function ReadStep({
  sentences,
  japanese,
  onFinish,
}: {
  sentences: string[];
  japanese: string[];
  onFinish: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [result, setResult] = useState<{ score: number; words: WordResult[] } | null>(null);
  const [heard, setHeard] = useState("");
  const [error, setError] = useState("");
  const [showHint, setShowHint] = useState(false);
  const stopRef = useRef<() => void>(() => {});
  const sentence = sentences[index];
  // 日本語訳がない（APIキー未設定）ときは英文を最初から見せる
  const prompt = japanese[index];
  const passed = result !== null && result.score >= PASS_SCORE;

  function start() {
    setError("");
    setResult(null);
    setHeard("");
    setRecording(true);
    stopRef.current = listen(
      (text) => {
        setHeard(text);
        setResult(scoreReading(sentence, text));
      },
      () => setRecording(false),
      (message) => {
        setError(message);
        setRecording(false);
      },
    );
  }

  function next() {
    setResult(null);
    setHeard("");
    setShowHint(false);
    if (index < sentences.length - 1) setIndex(index + 1);
    else onFinish();
  }

  return (
    <section className="space-y-4">
      <p className="text-sm opacity-70">
        日本語を見て、さっき練習した英語で言ってみましょう。{PASS_SCORE}点以上で合格です（{index + 1} / {sentences.length}）
      </p>
      <p className="rounded-lg border border-stone-300 dark:border-stone-700 p-4 text-xl">
        {prompt || sentence}
      </p>
      {!prompt && (
        <p className="text-sm text-amber-700">
          Claude APIのキーが未設定で日本語訳がないため、英文を表示しています。
        </p>
      )}
      {prompt && (showHint || result) && (
        <p className="rounded-lg bg-stone-200 dark:bg-stone-800 p-3 text-lg">
          {result
            ? result.words.map((w, i) => (
                <span key={i} className={w.ok ? "" : "text-red-600 underline"}>
                  {w.word}{" "}
                </span>
              ))
            : sentence}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        {recording ? (
          <button
            className="rounded-lg bg-red-600 px-5 py-2 text-white"
            onClick={() => stopRef.current()}
          >
            ■ 止める
          </button>
        ) : (
          <button
            className="rounded-lg bg-emerald-700 px-5 py-2 text-white"
            onClick={start}
          >
            ● 英語で言って採点
          </button>
        )}
        {prompt && !showHint && !result && (
          <button
            className="rounded-lg border border-stone-300 dark:border-stone-700 px-4 py-2"
            onClick={() => setShowHint(true)}
          >
            英文を見る（ヒント）
          </button>
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {result && (
        <div className="space-y-2">
          <p className={`text-2xl font-bold ${passed ? "text-emerald-700" : "text-red-600"}`}>
            {result.score}点 {passed ? "合格！" : "もう一度"}
          </p>
          <p className="text-sm opacity-60">聞き取った文: {heard}</p>
          {passed && (
            <button
              className="rounded-lg bg-emerald-700 px-5 py-2 text-white"
              onClick={next}
            >
              {index < sentences.length - 1 ? "次の文へ" : "完了"}
            </button>
          )}
        </div>
      )}
      <p className="text-xs opacity-50">
        採点は、添削後の英文と同じ単語をどれだけ言えたかで判定しています（言い換えると点が下がります）。Azureの発音評価に切り替えると、発音の正確さまで採点できます。
      </p>
    </section>
  );
}
