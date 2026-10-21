// ブラウザ標準の音声機能。AzureのTTS・発音評価に切り替えるまでの仮実装

export function speak(text: string, rate = 1) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = rate;
  const voice = window.speechSynthesis
    .getVoices()
    .find((v) => v.lang === "en-US");
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

type RecognitionResultEvent = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};

type Recognition = {
  lang: string;
  interimResults: boolean;
  onresult: ((e: RecognitionResultEvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function getRecognitionClass(): (new () => Recognition) | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as {
    SpeechRecognition?: new () => Recognition;
    webkitSpeechRecognition?: new () => Recognition;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

export function canRecognize() {
  return getRecognitionClass() !== undefined;
}

// 録音を始め、止めるための関数を返す。認識した英文は onText に届く
export function listen(
  onText: (text: string) => void,
  onEnd: () => void,
  onError: (message: string) => void,
) {
  const RecognitionClass = getRecognitionClass();
  if (!RecognitionClass) {
    onError("このブラウザは音声認識に対応していません（Chromeで開いてください）");
    return () => {};
  }
  const recognition = new RecognitionClass();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.onresult = (e) => {
    const text = Array.from(e.results)
      .map((r) => r[0].transcript)
      .join(" ");
    onText(text);
  };
  recognition.onerror = (e) => onError(`音声認識のエラー: ${e.error}`);
  recognition.onend = onEnd;
  recognition.start();
  return () => recognition.stop();
}
