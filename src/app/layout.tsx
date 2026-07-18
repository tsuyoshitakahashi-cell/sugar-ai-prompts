import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "SUGAR AIプロンプト集｜社内の業務をAIで時短する",
  description:
    "Sugar株式会社の全社員向けAIプロンプト集。仕入れ・設計・仕様書・パース生成・販売・営業・現場管理・バックオフィスまで、コピーして貼るだけで使えるプロンプトを業務カテゴリ別にまとめました。",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${notoSansJp.variable} h-full`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
