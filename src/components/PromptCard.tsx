"use client";

import { useState } from "react";
import type { Prompt } from "@/data/types";
import { categoryLabel, personLabel, painLabel, promptRank } from "@/data/taxonomy";
import { copyText, toolBadge } from "./prompt-utils";
import PromptModal from "./PromptModal";

export default function PromptCard({
  prompt,
  fav,
  onToggleFav,
}: {
  prompt: Prompt;
  fav: boolean;
  onToggleFav: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const cat = categoryLabel(prompt.category);
  const rank = promptRank(prompt.id);

  const doCopy = async () => {
    await copyText(prompt.body);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <article className="flex flex-col rounded-xl border border-border bg-surface shadow-sm">
      {/* 上部：カテゴリ帯 */}
      <div className="border-t-4 border-brand-500 px-4 pt-3.5" />
      <div className="px-4 pb-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-md bg-brand-600 px-2 py-0.5 text-xs font-semibold text-white">
              {cat.icon} {cat.label}
            </span>
            <span className="rounded-md border border-border px-2 py-0.5 text-[11px] font-medium text-muted">
              {toolBadge[prompt.tool]}
            </span>
            {rank === 1 && (
              <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                🔥 人気
              </span>
            )}
            {rank === 2 && (
              <span className="rounded-md border border-amber-300 px-2 py-0.5 text-[11px] font-semibold text-amber-600">
                ★ よく使う
              </span>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              onClick={() => onToggleFav(prompt.id)}
              aria-label="お気に入り"
              className={`text-lg leading-none transition ${fav ? "text-amber-400" : "text-border hover:text-amber-300"}`}
            >
              {fav ? "★" : "☆"}
            </button>
            <button
              onClick={doCopy}
              className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md border border-brand-400 px-2.5 py-1 text-xs font-semibold text-brand-700 transition hover:bg-brand-50"
            >
              {copied ? "✓ コピー済" : "⧉ コピー"}
            </button>
          </div>
        </div>

        <h3 className="text-base font-bold leading-snug">{prompt.title}</h3>

        {/* 使う時 / 用意 / できる */}
        <dl className="mt-2.5 space-y-1.5 text-sm">
          {[
            ["使う時", prompt.when],
            ["用意", prompt.prepare],
            ["できる", prompt.output],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-2">
              <dt className="w-10 shrink-0 font-semibold text-brand-700">{k}</dt>
              <dd className="text-muted">{v}</dd>
            </div>
          ))}
        </dl>

        {/* 担当者・お悩みタグ */}
        <div className="mt-2.5 flex flex-wrap gap-1">
          {prompt.personTags.map((p) => (
            <span key={p} className="rounded bg-chip px-1.5 py-0.5 text-[11px] text-muted">
              {personLabel(p).label}
            </span>
          ))}
          {prompt.painTags.map((t) => (
            <span key={t} className="rounded bg-chip px-1.5 py-0.5 text-[11px] text-muted">
              #{painLabel(t).label}
            </span>
          ))}
        </div>

        {prompt.note && (
          <p className="mt-2.5 border-t border-dashed border-border pt-2 text-xs leading-relaxed text-amber-700 dark:text-amber-500">
            ! {prompt.note}
          </p>
        )}

        {/* 全文モーダルを開く */}
        <button
          onClick={() => setOpen(true)}
          className="mt-3 text-sm font-bold text-brand-600 hover:text-brand-700"
        >
          プロンプト全文を見る・使う ▸
        </button>
      </div>

      {open && (
        <PromptModal
          prompt={prompt}
          fav={fav}
          onToggleFav={onToggleFav}
          onClose={() => setOpen(false)}
        />
      )}
    </article>
  );
}
