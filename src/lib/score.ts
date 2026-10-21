// 音読の仮採点: 認識された単語がお手本の単語とどれだけ一致したか（0〜100）
// Azureの発音評価に切り替えるまでのつなぎ
export function normalizeWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9' ]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export type WordResult = { word: string; ok: boolean };

export function scoreReading(target: string, heard: string) {
  const targetWords = normalizeWords(target);
  const heardWords = normalizeWords(heard);

  // 最長共通部分列で、順番どおりに言えた単語を数える
  const dp = Array.from({ length: targetWords.length + 1 }, () =>
    new Array<number>(heardWords.length + 1).fill(0),
  );
  for (let i = targetWords.length - 1; i >= 0; i--) {
    for (let j = heardWords.length - 1; j >= 0; j--) {
      dp[i][j] =
        targetWords[i] === heardWords[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const words: WordResult[] = [];
  let i = 0;
  let j = 0;
  while (i < targetWords.length) {
    if (j < heardWords.length && targetWords[i] === heardWords[j]) {
      words.push({ word: targetWords[i], ok: true });
      i++;
      j++;
    } else if (j < heardWords.length && dp[i][j + 1] >= dp[i + 1][j]) {
      j++;
    } else {
      words.push({ word: targetWords[i], ok: false });
      i++;
    }
  }

  const matched = words.filter((w) => w.ok).length;
  const score = targetWords.length
    ? Math.round((matched / targetWords.length) * 100)
    : 0;
  return { score, words };
}

export function splitSentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}
