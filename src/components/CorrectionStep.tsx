import type { CorrectionResult } from "@/lib/types";

export function CorrectionStep({
  result,
  onNext,
}: {
  result: CorrectionResult;
  onNext: () => void;
}) {
  return (
    <section className="space-y-4">
      {result.mock && (
        <p className="rounded-lg bg-amber-100 p-3 text-sm text-amber-900">
          Claude APIのキーが未設定のため、添削せずに文を分けただけで表示しています。
        </p>
      )}
      <ol className="space-y-3">
        {result.sentences.map((s, i) => (
          <li
            key={i}
            className="rounded-lg border border-stone-300 dark:border-stone-700 p-3"
          >
            {s.original !== s.corrected && (
              <p className="text-sm line-through opacity-50">{s.original}</p>
            )}
            <p className="text-lg">{s.corrected}</p>
            {s.reason && <p className="mt-1 text-sm opacity-70">{s.reason}</p>}
          </li>
        ))}
      </ol>
      <button
        className="rounded-lg bg-emerald-700 px-5 py-2 text-white"
        onClick={onNext}
      >
        シャドーイングへ
      </button>
    </section>
  );
}
