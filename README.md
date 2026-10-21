# English Diary

英語で日記を書く → AIが添削 → お手本音声でシャドーイング → 音読して合格するまで練習、を1つの流れでできるWebアプリのMVPです。

## 動かし方

```bash
npm install
cp .env.example .env.local   # Claude APIのキーを入れると本物の添削になります
npm run dev
```

ブラウザで http://localhost:3000 を開きます。音読チェックはブラウザの音声認識を使うので、Chromeで開いてください。

## 今の状態

| 機能 | 今の実装 | 次の予定 |
| --- | --- | --- |
| 添削 | Claude API（キー未設定なら文を分けるだけ） | 添削の指示文を調整 |
| お手本音声 | ブラウザ標準の読み上げ | Azure AI Speech のニューラル音声 |
| 音読の採点 | ブラウザの音声認識で、言えた単語の割合を採点 | Azure の発音評価（Pronunciation Assessment） |
| 保存 | なし | Supabase でログインと履歴 |

## ファイルの場所

- `src/app/page.tsx` 4つの画面の切り替え
- `src/components/` 各画面（書く・添削・シャドーイング・音読チェック）
- `src/app/api/correct/route.ts` 添削API（サーバー側。APIキーはここでだけ使う）
- `src/lib/score.ts` 仮の採点ロジック
- `src/lib/speech.ts` ブラウザの読み上げ・音声認識
