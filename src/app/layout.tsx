import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "English Diary",
  description: "英語日記を書いて、添削・シャドーイング・音読チェックまで",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
