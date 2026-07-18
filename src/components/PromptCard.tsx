"use client";

import { useState } from "react";
import type { Prompt } from "@/data/types";
import { categoryLabel, personLabel, painLabel, promptRank } from "@/data/taxonomy";

function copyText(text: string) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
  return Promise.resolve();
}

function Highlighted({ body }: { body: string }) {
  const parts = body.split(/(\{[^{}]+\})/g);
  return (
    <>
      {parts.map((p, i) =>
        /^\{[^{}]+\}$/.test(p) ? (
          <span key={i} className="ph">
            {p}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

const toolBadge: Record<string, string> = {
  chatgpt: "ChatGPT",
  claude: "Claude",
  both: "ChatGPT / Claude",
};
const toolUrl = {
  chatgpt: "https://chatgpt.com/",
  claude: "https://claude.ai/new",
} as const;

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
  const [copied, setCopied] = useState<string | null>(null);
  const cat = categoryLabel(prompt.category);
  const rank = promptRank(prompt.id);

  const flash = (key: string) => {
    setCopied(key);
    window.setTimeout(() => setCopied((c) => (c === key ? null : c)), 1600);
  };
  const doCopy = async () => {
    await copyText(prompt.body);
    flash("copy");
  };
  const openWith = async (t: "chatgpt" | "claude") => {
    await copyText(prompt.body);
    flash(t);
    window.open(toolUrl[t], "_blank", "noopener,noreferrer");
  };
  const tools: ("chatgpt" | "claude")[] =
    prompt.tool === "both" ? ["chatgpt", "claude"] : [prompt.tool];

  return (
    <article className="flex flex-col rounded-xl border border-border bg-surface shadow-sm">
      {/* 上部：カテゴリ帯 */}
      <div className="border-t-4 border-brand-500 px-4 pt-3.5" />
      <div className="px-4 pb-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
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
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onToggleFav(prompt.id)}
              aria-label="お気に入り"
              className={`text-lg leading-none transition ${fav ? "text-amber-400" : "text-border hover:text-amber-300"}`}
            >
              {fav ? "★" : "☆"}
            </button>
            <button
              onClick={doCopy}
              className="inline-flex items-center gap-1 rounded-md border border-brand-400 px-2.5 py-1 text-xs font-semibold text-brand-700 transition hover:bg-brand-50"
            >
              {copied === "copy" ? "✓ コピー済" : "⧉ コピー"}
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

        {/* 展開トグル */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="mt-3 text-sm font-bold text-brand-600 hover:text-brand-700"
        >
          {open ? "▲ 閉じる" : "プロンプト全文を見る・使う ▸"}
        </button>

        {open && (
          <div className="mt-2">
            <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-border bg-background p-3 text-[13px] leading-relaxed text-foreground">
              <Highlighted body={prompt.body} />
            </pre>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                onClick={doCopy}
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
              >
                {copied === "copy" ? "✓ コピーしました" : "全文コピー"}
              </button>
              {tools.map((t) => (
                <button
                  key={t}
                  onClick={() => openWith(t)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground transition hover:border-brand-400 hover:text-brand-700"
                >
                  {copied === t ? "✓ コピー→開きました" : `${toolBadge[t]}で開く`}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
