"use client";

import { useState } from "react";
import type { Prompt } from "@/data/types";
import { categoryLabel, personLabel, painLabel } from "@/data/taxonomy";

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

const toolMeta: Record<string, { label: string; url: string; cls: string }> = {
  chatgpt: { label: "ChatGPTで開く", url: "https://chatgpt.com/", cls: "" },
  claude: { label: "Claudeで開く", url: "https://claude.ai/new", cls: "" },
};

export default function PromptCard({ prompt }: { prompt: Prompt }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const cat = categoryLabel(prompt.category);

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
    window.open(toolMeta[t].url, "_blank", "noopener,noreferrer");
  };

  const tools: ("chatgpt" | "claude")[] =
    prompt.tool === "both" ? ["chatgpt", "claude"] : [prompt.tool];

  return (
    <article className="flex flex-col rounded-xl border border-border bg-surface p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 font-medium text-brand-700">
              {cat.icon} {cat.label}
            </span>
            {prompt.personTags.map((p) => (
              <span key={p} className="rounded-full bg-chip px-2 py-0.5 text-muted">
                {personLabel(p).label}
              </span>
            ))}
          </div>
          <h3 className="text-base font-bold leading-snug">{prompt.title}</h3>
        </div>
      </div>

      <p className="mt-1.5 text-sm text-muted">{prompt.summary}</p>

      {prompt.painTags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {prompt.painTags.map((t) => (
            <span key={t} className="rounded bg-chip px-1.5 py-0.5 text-[11px] text-muted">
              #{painLabel(t).label}
            </span>
          ))}
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="mt-3 self-start text-sm font-medium text-brand-600 hover:text-brand-700"
      >
        {open ? "▲ プロンプトを閉じる" : "▼ プロンプト全文を見る"}
      </button>

      {open && (
        <pre className="mt-2 max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-border bg-background p-3 text-[13px] leading-relaxed text-foreground">
          <Highlighted body={prompt.body} />
        </pre>
      )}

      {prompt.note && (
        <p className="mt-2 rounded-lg bg-brand-50 px-3 py-2 text-xs leading-relaxed text-brand-700">
          💡 {prompt.note}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
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
            {copied === t ? "✓ コピー→開きました" : toolMeta[t].label}
          </button>
        ))}
      </div>
    </article>
  );
}
