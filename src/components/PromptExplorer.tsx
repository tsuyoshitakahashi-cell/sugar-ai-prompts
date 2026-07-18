"use client";

import { useEffect, useMemo, useState } from "react";
import { prompts } from "@/data/prompts";
import {
  categories,
  persons,
  pains,
  roles,
  promptRoles,
  promptRank,
  quickStartIds,
  toolFilters,
} from "@/data/taxonomy";
import type { CategoryId, PersonId, PainId, RoleId, Prompt } from "@/data/types";
import PromptCard from "./PromptCard";

const FAV_KEY = "sugar-fav-v1";
type ToolFilter = "chatgpt" | "claude" | "both";

type Filters = {
  category: CategoryId | null;
  roles: RoleId[];
  persons: PersonId[];
  pains: PainId[];
  tool: ToolFilter | null;
  q: string;
  favOnly: boolean;
};

function matches(p: Prompt, f: Filters, favs: Set<string>) {
  if (f.favOnly && !favs.has(p.id)) return false;
  if (f.category && p.category !== f.category) return false;
  if (f.roles.length && !f.roles.some((x) => promptRoles(p).includes(x))) return false;
  if (f.persons.length && !f.persons.some((x) => p.personTags.includes(x))) return false;
  if (f.pains.length && !f.pains.every((x) => p.painTags.includes(x))) return false;
  if (f.tool && p.tool !== f.tool) return false;
  if (f.q) {
    const hay = (p.title + p.when + p.prepare + p.output + p.body).toLowerCase();
    if (!hay.includes(f.q.toLowerCase())) return false;
  }
  return true;
}

export default function PromptExplorer() {
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [selRoles, setSelRoles] = useState<RoleId[]>([]);
  const [selPersons, setSelPersons] = useState<PersonId[]>([]);
  const [selPains, setSelPains] = useState<PainId[]>([]);
  const [selTool, setSelTool] = useState<ToolFilter | null>(null);
  const [q, setQ] = useState("");
  const [favOnly, setFavOnly] = useState(false);
  const [favs, setFavs] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAV_KEY);
      if (raw) setFavs(new Set(JSON.parse(raw)));
    } catch {}
  }, []);

  const toggleFav = (id: string) => {
    setFavs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem(FAV_KEY, JSON.stringify([...next]));
      } catch {}
      return next;
    });
  };

  const filters: Filters = {
    category,
    roles: selRoles,
    persons: selPersons,
    pains: selPains,
    tool: selTool,
    q,
    favOnly,
  };

  // おすすめ順（🔥/★を上位）→ 同ランクは配列順を維持（安定ソート）
  const results = useMemo(
    () =>
      prompts
        .filter((p) => matches(p, filters, favs))
        .sort((a, b) => promptRank(a.id) - promptRank(b.id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [category, selRoles, selPersons, selPains, selTool, q, favOnly, favs],
  );

  // ファセット件数
  const catCount = (c: CategoryId) =>
    prompts.filter((p) => p.category === c && matches(p, { ...filters, category: null }, favs)).length;
  const roleCount = (id: RoleId) =>
    prompts.filter((p) => promptRoles(p).includes(id) && matches(p, { ...filters, roles: [] }, favs)).length;
  const personCount = (id: PersonId) =>
    prompts.filter((p) => p.personTags.includes(id) && matches(p, { ...filters, persons: [] }, favs)).length;
  const painCount = (id: PainId) =>
    prompts.filter((p) =>
      matches(p, { ...filters, pains: Array.from(new Set([...selPains, id])) }, favs),
    ).length;
  const toolCount = (id: ToolFilter) =>
    prompts.filter((p) => matches(p, { ...filters, tool: id }, favs)).length;

  const toggle = <T,>(list: T[], v: T): T[] =>
    list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
  const clearAll = () => {
    setCategory(null);
    setSelRoles([]);
    setSelPersons([]);
    setSelPains([]);
    setSelTool(null);
    setQ("");
    setFavOnly(false);
  };
  const active = !!(
    category ||
    selRoles.length ||
    selPersons.length ||
    selPains.length ||
    selTool ||
    q.trim() ||
    favOnly
  );

  // 「まず使う3本」— 何も絞り込んでいないときだけトップに表示
  const quickStart = quickStartIds
    .map((id) => prompts.find((p) => p.id === id))
    .filter((p): p is Prompt => !!p);
  const showQuickStart = !active;

  return (
    <section id="prompts" className="mx-auto w-full max-w-7xl gap-6 px-4 py-8 lg:flex">
      {/* ───── サイドバー ───── */}
      <aside className="mb-6 shrink-0 lg:mb-0 lg:w-64">
        <div className="lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-auto lg:pr-1">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="🔍 キーワードで検索…"
            className="mb-3 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-brand-500"
          />

          {/* お気に入り */}
          <button
            onClick={() => setFavOnly((v) => !v)}
            className={`mb-4 flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
              favOnly
                ? "border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-950/40"
                : "border-border bg-surface text-foreground hover:border-amber-300"
            }`}
          >
            <span>★ お気に入り</span>
            <span className="rounded-full bg-chip px-2 text-xs text-muted">{favs.size}</span>
          </button>

          {/* ツール */}
          <div className="mb-4">
            <div className="mb-1.5 text-xs font-bold text-muted">使うAIで絞り込む</div>
            <div className="grid grid-cols-3 gap-1.5">
              {toolFilters.map((t) => {
                const on = selTool === t.id;
                const n = toolCount(t.id);
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelTool(on ? null : t.id)}
                    className={`flex flex-col items-center gap-0.5 rounded-lg border px-1 py-2 text-center transition ${
                      on
                        ? "border-brand-500 bg-brand-500 text-white"
                        : "border-border bg-surface text-foreground hover:border-brand-400"
                    }`}
                  >
                    <span className="text-sm leading-none">{t.icon}</span>
                    <span className="text-[11px] font-medium leading-tight">{t.label}</span>
                    <span className={`text-[10px] leading-none ${on ? "text-white/80" : "text-muted"}`}>{n}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* カテゴリ */}
          <div className="mb-4">
            <div className="mb-1.5 text-xs font-bold text-muted">業務カテゴリで絞り込む</div>
            <ul className="space-y-0.5">
              <li>
                <button
                  onClick={() => setCategory(null)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                    !category ? "bg-brand-500 font-semibold text-white" : "text-foreground hover:bg-chip"
                  }`}
                >
                  <span>すべて</span>
                  <span className={!category ? "text-white/80" : "text-muted"}>{prompts.length}</span>
                </button>
              </li>
              {categories.map((c) => {
                const n = catCount(c.id);
                const on = category === c.id;
                return (
                  <li key={c.id}>
                    <button
                      onClick={() => setCategory(on ? null : c.id)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                        on ? "bg-brand-500 font-semibold text-white" : "text-foreground hover:bg-chip"
                      }`}
                    >
                      <span className="truncate">{c.icon} {c.label}</span>
                      <span className={on ? "text-white/80" : "text-muted"}>{n}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* 職種 */}
          <div className="mb-4">
            <div className="mb-1.5 text-xs font-bold text-muted">
              職種で絞り込む <span className="font-normal">複数＝いずれか</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {roles.map((r) => {
                const on = selRoles.includes(r.id);
                const n = roleCount(r.id);
                const disabled = !on && n === 0;
                return (
                  <button
                    key={r.id}
                    disabled={disabled}
                    onClick={() => setSelRoles((l) => toggle(l, r.id))}
                    title={r.desc}
                    className={`rounded-full border px-2.5 py-1 text-xs transition ${
                      on
                        ? "border-brand-500 bg-brand-500 text-white"
                        : disabled
                          ? "cursor-not-allowed border-border/60 text-border"
                          : "border-border bg-surface text-foreground hover:border-brand-400"
                    }`}
                  >
                    {r.icon} {r.label} <span className={on ? "text-white/80" : "text-muted"}>{n}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* お悩みタグ */}
          <div className="mb-4">
            <div className="mb-1.5 text-xs font-bold text-muted">
              お悩みタグ <span className="font-normal">複数＝すべて含む</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {pains.map((p) => {
                const on = selPains.includes(p.id);
                const n = painCount(p.id);
                const disabled = !on && n === 0;
                return (
                  <button
                    key={p.id}
                    disabled={disabled}
                    onClick={() => setSelPains((l) => toggle(l, p.id))}
                    className={`rounded-full border px-2.5 py-1 text-xs transition ${
                      on
                        ? "border-brand-500 bg-brand-500 text-white"
                        : disabled
                          ? "cursor-not-allowed border-border/60 text-border"
                          : "border-border bg-surface text-foreground hover:border-brand-400"
                    }`}
                  >
                    #{p.label} <span className={on ? "text-white/80" : "text-muted"}>{n}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 担当者 */}
          <div className="mb-4">
            <div className="mb-1.5 text-xs font-bold text-muted">担当者で絞り込む</div>
            <div className="flex flex-wrap gap-1.5">
              {persons.map((p) => {
                const on = selPersons.includes(p.id);
                const n = personCount(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelPersons((l) => toggle(l, p.id))}
                    title={p.role}
                    className={`rounded-full border px-2.5 py-1 text-xs transition ${
                      on
                        ? "border-brand-500 bg-brand-500 text-white"
                        : "border-border bg-surface text-foreground hover:border-brand-400"
                    }`}
                  >
                    {p.label} <span className={on ? "text-white/80" : "text-muted"}>{n}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {active ? (
            <button
              onClick={clearAll}
              className="text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              条件をすべてクリア
            </button>
          ) : null}
        </div>
      </aside>

      {/* ───── メイン ───── */}
      <div className="min-w-0 flex-1">
        {/* まず使うN本（未絞り込み時のみ） */}
        {showQuickStart && (
          <div className="mb-6 rounded-2xl border border-brand-200 bg-brand-50/60 p-4 dark:border-brand-800 dark:bg-brand-950/30">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-sm font-bold text-brand-700">🚀 まず使う{quickStart.length}本</span>
              <span className="text-xs text-muted">迷ったらここから</span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {quickStart.map((p) => (
                <PromptCard key={`qs-${p.id}`} prompt={p} fav={favs.has(p.id)} onToggleFav={toggleFav} />
              ))}
            </div>
          </div>
        )}

        <div className="mb-4 flex items-baseline gap-2">
          <span className="text-xl font-bold text-foreground">{results.length}</span>
          <span className="text-sm text-muted">件のプロンプト</span>
          {!active && <span className="text-xs text-muted">・おすすめ順</span>}
        </div>

        {results.length === 0 ? (
          <p className="rounded-xl border border-border bg-surface p-8 text-center text-muted">
            該当するプロンプトがありません。条件をゆるめてみてください。
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((p) => (
              <PromptCard
                key={p.id}
                prompt={p}
                fav={favs.has(p.id)}
                onToggleFav={toggleFav}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
