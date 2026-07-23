"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Prompt } from "@/data/types";
import { categoryLabel, promptRank } from "@/data/taxonomy";
import { Highlighted, copyText, toolBadge, toolUrl, toolsOf } from "./prompt-utils";

export default function PromptModal({
  prompt,
  fav,
  onToggleFav,
  onClose,
}: {
  prompt: Prompt;
  fav: boolean;
  onToggleFav: (id: string) => void;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const cat = categoryLabel(prompt.category);
  const rank = promptRank(prompt.id);
  const tools = toolsOf(prompt);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

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

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm sm:items-center animate-[fadeIn_0.15s_ease-out]"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="prompt-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="modal-panel my-auto flex max-h-[88vh] w-[92vw] max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
      >
        {/* ヘッダー */}
        <div className="flex items-start justify-between gap-2 border-b border-border px-5 pt-5 pb-3">
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
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
              className={`rounded-md px-1.5 text-lg leading-none transition ${fav ? "text-amber-400" : "text-border hover:text-amber-300"}`}
            >
              {fav ? "★ お気に入り" : "☆ お気に入り"}
            </button>
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="閉じる"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-lg text-muted transition hover:bg-chip hover:text-foreground"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 本体（スクロール領域） */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <h2 id="prompt-modal-title" className="text-lg font-bold leading-snug">
            {prompt.title}
          </h2>

          <dl className="mt-3 space-y-1.5 text-sm">
            {[
              ["使う時", prompt.when],
              ["用意するもの", prompt.prepare],
              ["できること", prompt.output],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-2">
                <dt className="w-24 shrink-0 font-semibold text-brand-700">{k}</dt>
                <dd className="text-muted">{v}</dd>
              </div>
            ))}
          </dl>

          {/* { } 書き換え注記 */}
          <p className="mt-4 rounded-lg bg-accent/10 px-3 py-2.5 text-xs leading-relaxed text-foreground">
            この中の <span className="ph">{"{ }"}</span> を、あなたの会社の数字・名前に書き換えてから送信してください。
            <span className="font-semibold">{"【 】"}</span> は見出しなのでそのままでOKです。
          </p>

          {/* 本文 */}
          <pre className="mt-3 whitespace-pre-wrap break-words rounded-lg border border-border bg-background p-3.5 text-[13px] leading-relaxed text-foreground">
            <Highlighted body={prompt.body} />
          </pre>

          {prompt.note && (
            <p className="mt-3 border-t border-dashed border-border pt-2.5 text-xs leading-relaxed text-amber-700 dark:text-amber-500">
              ヒント：{prompt.note}
            </p>
          )}
        </div>

        {/* フッター（操作ボタン） */}
        <div className="flex flex-wrap gap-2 border-t border-border bg-surface px-5 py-3.5">
          <button
            onClick={doCopy}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 sm:flex-none"
          >
            {copied === "copy" ? "✓ コピーしました" : "⧉ 全文をコピー"}
          </button>
          {tools.map((t) => (
            <button
              key={t}
              onClick={() => openWith(t)}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-brand-400 hover:text-brand-700"
            >
              {copied === t ? "✓ コピー→開きました" : `${toolBadge[t]}で開く ↗`}
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
