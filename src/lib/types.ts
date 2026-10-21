export type CorrectedSentence = {
  original: string;
  corrected: string;
  // 直した理由（日本語）。直していなければ空文字
  reason: string;
};

export type CorrectionResult = {
  sentences: CorrectedSentence[];
  // APIキーがなく、添削せずに返したとき true
  mock: boolean;
};
