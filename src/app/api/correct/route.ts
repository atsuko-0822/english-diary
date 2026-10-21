import { NextResponse } from "next/server";
import { splitSentences } from "@/lib/score";
import type { CorrectedSentence, CorrectionResult } from "@/lib/types";

const SYSTEM_PROMPT = `You correct English diary entries written by Japanese learners who want to practice speaking.
Rules:
- Keep the writer's meaning. Do not add new content.
- Fix grammar and unnatural phrasing so each sentence sounds like natural spoken English.
- Prefer words a high-school student knows; keep sentences short enough to say in one breath.
- If the writer used Japanese words, translate them into natural English.
- Give the reason for each change in short, plain Japanese (one sentence). If a sentence needed no change, reason is "".
- Give a natural Japanese translation of each corrected sentence in "japanese". The learner will see only this and say the English from memory, so keep it close to the English meaning.
Reply with JSON only, in this shape:
{"sentences":[{"original":"...","corrected":"...","reason":"...","japanese":"..."}]}`;

export async function POST(request: Request) {
  const { text } = (await request.json()) as { text?: string };
  if (!text || !text.trim()) {
    return NextResponse.json({ error: "日記が空です" }, { status: 400 });
  }
  if (text.length > 2000) {
    return NextResponse.json(
      { error: "2000文字以内で書いてください" },
      { status: 400 },
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // キー未設定の間は、文に分けるだけで画面の流れを試せるようにする
    const sentences: CorrectedSentence[] = splitSentences(text).map((s) => ({
      original: s,
      corrected: s,
      reason: "",
      japanese: "",
    }));
    return NextResponse.json({ sentences, mock: true } satisfies CorrectionResult);
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-haiku-5-5",
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: text }],
    }),
  });

  if (!res.ok) {
    console.error("Claude API error", res.status, await res.text());
    return NextResponse.json(
      { error: "添削に失敗しました。時間をおいて試してください" },
      { status: 502 },
    );
  }

  const data = (await res.json()) as { content: { type: string; text?: string }[] };
  const raw = data.content.find((c) => c.type === "text")?.text ?? "";
  const json = raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);
  try {
    const parsed = JSON.parse(json) as { sentences: CorrectedSentence[] };
    return NextResponse.json({
      sentences: parsed.sentences,
      mock: false,
    } satisfies CorrectionResult);
  } catch {
    console.error("Could not parse correction", raw);
    return NextResponse.json(
      { error: "添削結果を読み取れませんでした。もう一度試してください" },
      { status: 502 },
    );
  }
}
