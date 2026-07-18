"use client";

import { useMemo, useState } from "react";
import { prompts } from "@/data/prompts";
import { categories, persons, pains } from "@/data/taxonomy";
import type { CategoryId, PersonId, PainId } from "@/data/types";
import PromptCard from "./PromptCard";

export default function PromptExplorer() {
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [selPersons, setSelPersons] = useState<PersonId[]>([]);
  const [selPains, setSelPains] = useState<PainId[]>([]);
  const [q, setQ] = useState("");

  const toggle = <T,>(list: T[], v: T): T[] =>
    list.includes(v) ? list.filter((x) => x !== v) : [...list, v];

  const clearAll = () => {
    setCategory(null);
    setSelPersons([]);
    setSelPains([]);
    setQ("");
  };

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    return prompts.filter((p) => {
      if (category && p.category !== category) return false;
      if (selPersons.length && !selPersons.some((x) => p.personTags.includes(x)))
        return false;
      // お悩みタグは「すべて含む」(AND)
      if (selPains.length && !selPains.every((x) => p.painTags.includes(x)))
        return false;
      if (query) {
        const hay = (p.title + p.summary + p.body).toLowerCase();
        if (!hay.includes(query)) return false;
      }
      return true;
    });
  }, [category, selPersons, selPains, q]);

  const active =
    !!category || selPersons.length > 0 || selPains.length > 0 || q.trim() !== "";

  const chip = (on: boolean) =>
    `rounded-full border px-3 py-1.5 text-sm transition ${
      on
        ? "border-brand-500 bg-brand-500 text-white"
        : "border-border bg-surface text-foreground hover:border-brand-400"
    }`;

  return (
    <section id="prompts" className="mx-auto w-full max-w-6xl px-4 py-8">
      {/* 検索 */}
      <div className="mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="キーワードで探す（例：マイソク、追客、間取り、請求書…）"
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-base outline-none focus:border-brand-500"
        />
      </div>

      {/* 業務カテゴリ */}
      <div className="mb-3">
        <div className="mb-1.5 text-xs font-semibold text-muted">業務カテゴリ</div>
        <div className="flex flex-wrap gap-2">
          <button className={chip(!category)} onClick={() => setCategory(null)}>
            すべて
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              className={chip(category === c.id)}
              onClick={() => setCategory(category === c.id ? null : c.id)}
              title={c.desc}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* 担当者 */}
      <div className="mb-3">
        <div className="mb-1.5 text-xs font-semibold text-muted">担当者</div>
        <div className="flex flex-wrap gap-2">
          {persons.map((p) => (
            <button
              key={p.id}
              className={chip(selPersons.includes(p.id))}
              onClick={() => setSelPersons((l) => toggle(l, p.id))}
              title={p.role}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* お悩みタグ */}
      <div className="mb-3">
        <div className="mb-1.5 text-xs font-semibold text-muted">
          お悩みタグ（複数選ぶと「すべて含む」で絞り込み）
        </div>
        <div className="flex flex-wrap gap-2">
          {pains.map((p) => (
            <button
              key={p.id}
              className={chip(selPains.includes(p.id))}
              onClick={() => setSelPains((l) => toggle(l, p.id))}
            >
              #{p.label}
            </button>
          ))}
        </div>
      </div>

      {/* 件数＋クリア */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted">
          <span className="font-bold text-foreground">{results.length}</span> 件
        </p>
        {active && (
          <button
            onClick={clearAll}
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            条件をすべてクリア
          </button>
        )}
      </div>

      {/* 結果 */}
      {results.length === 0 ? (
        <p className="rounded-xl border border-border bg-surface p-8 text-center text-muted">
          該当するプロンプトがありません。条件をゆるめてみてください。
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {results.map((p) => (
            <PromptCard key={p.id} prompt={p} />
          ))}
        </div>
      )}
    </section>
  );
}
