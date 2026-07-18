import Image from "next/image";
import PromptExplorer from "@/components/PromptExplorer";
import { prompts } from "@/data/prompts";
import { categories } from "@/data/taxonomy";
import { flagships } from "@/data/flagship";

const steps = [
  { n: "1", t: "探す", d: "業務カテゴリ・担当者・お悩み・キーワードで、使いたいプロンプトを見つける" },
  { n: "2", t: "コピー", d: "「全文コピー」を押す。ChatGPT／Claudeのボタンならコピー＆その場で開く" },
  { n: "3", t: "貼って送信", d: "AIに貼り付け、{ } の部分を自社・物件の情報に書き換えて送信" },
];

export default function Home() {
  return (
    <>
      {/* ヘッダー */}
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <Image
              src="/sugar-logo.png"
              alt="Sugar株式会社"
              width={852}
              height={400}
              priority
              className="h-9 w-auto"
            />
            <div className="hidden sm:block">
              <div className="text-sm font-bold leading-tight">AIプロンプト集</div>
              <div className="text-xs text-muted">社内の業務をAIで時短する</div>
            </div>
          </div>
          <a
            href="#prompts"
            className="rounded-lg bg-brand-500 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-600"
          >
            プロンプトを探す
          </a>
        </div>
      </header>

      {/* ヒーロー */}
      <section className="border-b border-border bg-gradient-to-b from-brand-50 to-background">
        <div className="mx-auto w-full max-w-6xl px-4 py-10">
          <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
            SUGAR AIプロンプト集
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">
            仕入れ・査定から、設計・仕様書・パース生成・販売・営業・現場管理・バックオフィスまで。
            コピーして貼るだけで使える「型」を、業務カテゴリ別に{prompts.length}本そろえました。
          </p>

          {/* 使い方3ステップ */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {steps.map((s) => (
              <div
                key={s.n}
                className="rounded-xl border border-border bg-surface p-4"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                    {s.n}
                  </span>
                  <span className="font-bold">{s.t}</span>
                </div>
                <p className="mt-2 text-sm text-muted">{s.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted">
            <span className="ph">{"{ }"}</span> は自社・物件の情報に書き換える場所、【 】はプロンプト内の見出しです。
          </p>
        </div>
      </section>

      {/* フラッグシップ（専用ツール） */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-8">
        <div className="mb-3">
          <h2 className="text-lg font-bold">🚀 SUGAR専用ツール（構築済み）</h2>
          <p className="text-sm text-muted">
            コピペではなく、SUGAR様向けに作り込んだAIの仕組みです。使い方は担当（SHO-SAN）までお問い合わせください。
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {flagships.map((f) => (
            <div
              key={f.id}
              className="flex flex-col rounded-xl border border-brand-200 bg-brand-50 p-4"
            >
              <span className="mb-1 w-fit rounded-full bg-brand-500 px-2 py-0.5 text-[11px] font-medium text-white">
                {f.tool}
              </span>
              <h3 className="text-base font-bold text-brand-700">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground">
                {f.description}
              </p>
              {f.hrefLabel && (
                <span className="mt-3 text-xs font-medium text-brand-600">
                  ▶ {f.hrefLabel}（社内で案内）
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* カテゴリ早見 */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-6">
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="text-xs font-semibold text-muted">収録カテゴリ</div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {categories.map((c) => (
              <span key={c.id} className="text-muted">
                {c.icon} {c.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* プロンプト一覧 */}
      <PromptExplorer />

      {/* フッター */}
      <footer className="mt-auto border-t border-border bg-surface">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 text-sm text-muted">
          <p className="font-bold text-foreground">Sugar株式会社 AIプロンプト集</p>
          <p className="mt-1">
            神奈川県藤沢市 ／{" "}
            <a
              href="https://sugar-renovation.jp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 hover:underline"
            >
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
