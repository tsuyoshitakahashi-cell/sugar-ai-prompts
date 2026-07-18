import Image from "next/image";
import PromptExplorer from "@/components/PromptExplorer";
import { prompts } from "@/data/prompts";
import { categories } from "@/data/taxonomy";
import { flagships } from "@/data/flagship";

const stats = [
  { big: `${prompts.length}`, small: "本のプロンプト" },
  { big: `${categories.length}`, small: "カテゴリを網羅" },
  { big: "コピペ", small: "で今すぐ使える" },
  { big: "無料", small: "ChatGPT / Claude対応" },
];

const steps = [
  { n: "1", t: "探す", d: "カテゴリ・キーワード・お悩みから" },
  { n: "2", t: "全文をコピー", d: "ワンクリックでコピー" },
  { n: "3", t: "貼って送信", d: "{ } を自社・物件の情報に書き換えて送信" },
];

export default function Home() {
  return (
    <>
      {/* ヘッダー */}
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <Image src="/sugar-logo.png" alt="Sugar株式会社" width={852} height={400} priority className="h-9 w-auto" />
            <div className="hidden sm:block">
              <div className="text-sm font-bold leading-tight">AIプロンプト集</div>
              <div className="text-xs text-muted">社内の業務をAIで時短する</div>
            </div>
          </div>
          <a href="#prompts" className="rounded-lg bg-brand-500 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-600">
            プロンプトを探す
          </a>
        </div>
      </header>

      {/* ヒーロー（ダーク） */}
      <section className="bg-slate-900 text-slate-100">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:py-12">
          <span className="inline-block rounded-full bg-brand-500/20 px-3 py-1 text-xs font-semibold text-brand-200">
            SUGAR 社内AIツール
          </span>
          <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
            住宅・不動産・リノベのための
            <br />
            <span className="text-brand-400">AIプロンプト{prompts.length}</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
            <span className="font-semibold text-white">ChatGPT・Claudeに貼るだけ。</span>
            現場で本当に使えるAI指示文を、業務カテゴリとお悩みから探せます。
          </p>

          {/* スタッツ */}
          <div className="mt-6 flex flex-wrap gap-2.5">
            {stats.map((s) => (
              <div key={s.small} className="rounded-xl bg-white/5 px-4 py-2.5">
                <span className="text-lg font-bold text-brand-400">{s.big}</span>{" "}
                <span className="text-xs text-slate-300">{s.small}</span>
              </div>
            ))}
          </div>

          {/* 3ステップ */}
          <div className="mt-4 flex flex-wrap gap-2">
            {steps.map((s) => (
              <div key={s.n} className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-sm">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">
                  {s.n}
                </span>
                <span className="font-semibold text-white">{s.t}</span>
                <span className="hidden text-xs text-slate-400 md:inline">{s.d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* フラッグシップ（専用ツール） */}
      <section className="mx-auto w-full max-w-7xl px-4 pt-8">
        <div className="mb-3">
          <h2 className="text-lg font-bold">🚀 SUGAR専用ツール（構築済み）</h2>
          <p className="text-sm text-muted">
            コピペではなく、SUGAR様向けに作り込んだAIの仕組みです。使い方は担当（SHO-SAN）までお問い合わせください。
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {flagships.map((f) => (
            <div key={f.id} className="flex flex-col rounded-xl border border-brand-200 bg-brand-50 p-4">
              <span className="mb-1 w-fit rounded-full bg-brand-500 px-2 py-0.5 text-[11px] font-medium text-white">
                {f.tool}
              </span>
              <h3 className="text-base font-bold text-brand-700">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground">{f.description}</p>
              {f.hrefLabel && (
                <span className="mt-3 text-xs font-medium text-brand-600">▶ {f.hrefLabel}（社内で案内）</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* プロンプト一覧（左サイドバー＋グリッド） */}
      <PromptExplorer />

      {/* フッター */}
      <footer className="mt-auto border-t border-border bg-surface">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 text-sm text-muted">
          <p className="font-bold text-foreground">Sugar株式会社 AIプロンプト集</p>
          <p className="mt-1">
            神奈川県藤沢市 ／{" "}
            <a href="https://sugar-renovation.jp" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
              sugar-renovation.jp
            </a>
          </p>
          <p className="mt-3 text-xs leading-relaxed">
            ※ プロンプトはあくまで下書き・たたき台を作るための「型」です。金額・法規・お客様への説明など重要な内容は、
            必ず一次情報で確認し、最終判断はご自身で行ってください。担当者名・連絡先などの個人情報は各自の情報に置き換えてご利用ください。
          </p>
          <p className="mt-3 text-xs text-muted">Powered by SHO-SAN</p>
        </div>
      </footer>
    </>
  );
}
