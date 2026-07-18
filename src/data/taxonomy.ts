import type { CategoryId, PersonId, PainId, RoleId, Prompt } from "./types";

export const categories: { id: CategoryId; label: string; icon: string; desc: string }[] = [
  { id: "shiire", label: "仕入れ・査定", icon: "🔑", desc: "買取価格試算・査定コメント・仲介への打診・物件調査" },
  { id: "research", label: "リサーチ・エリア分析", icon: "🔎", desc: "相場・ハザード・周辺環境・ペルソナ・コンセプト" },
  { id: "design", label: "設計・プランニング", icon: "📐", desc: "間取り改善・新築プラン・コンセプト・仕上げ・素材選定" },
  { id: "spec", label: "見積・仕様書", icon: "📋", desc: "品番調べ・仕上げ表・拾い出し・見積チェック・仕様説明" },
  { id: "visual", label: "パース・画像生成", icon: "🎨", desc: "外観/内観パース・新築/リノベ・ステージング・更地合成" },
  { id: "sales", label: "販売・集客", icon: "📣", desc: "マイソク・物件紹介文・ポータル/SNS・建売販促" },
  { id: "eigyo", label: "営業・接客", icon: "🤝", desc: "反響対応・追客・ヒアリング・提案書・ローン説明・アフター" },
  { id: "genba", label: "現場管理", icon: "🔨", desc: "工程表・職人手配・進捗報告・引渡し・定期点検" },
  { id: "backoffice", label: "バックオフィス・経営", icon: "🗂️", desc: "請求書集計・原価/資金繰り・議事録・マニュアル化" },
  { id: "basic", label: "AI活用の基本", icon: "🧭", desc: "プロンプトの型・画像修正の指示・壁打ち・要約・仕組み化" },
];

/** 職種（役割）— 職種別業務理解マップに対応。担当者名に依存しない役割軸 */
export const roles: { id: RoleId; label: string; icon: string; desc: string }[] = [
  { id: "keiei", label: "経営・バックオフィス", icon: "🏢", desc: "仕入れ判断・値付け・資金繰り・原価・請求書・議事録" },
  { id: "fudosan", label: "不動産・仕入れ", icon: "🏠", desc: "物件調査・査定・買取再販・相場リサーチ" },
  { id: "eigyo", label: "営業・販売", icon: "🤝", desc: "反響・接客・提案・追客・マイソク・集客・アフター" },
  { id: "sekkei", label: "設計・積算", icon: "✏️", desc: "間取り・仕上げ・パース・拾い出し・見積・仕様書" },
  { id: "genba", label: "現場・施工管理", icon: "🔨", desc: "工程・職人手配・進捗・引渡し・点検" },
];

/** category → 職種 の既定マッピング（roleTags 未指定のプロンプトに適用） */
export const categoryRoles: Record<CategoryId, RoleId[]> = {
  shiire: ["fudosan", "keiei"],
  research: ["fudosan", "eigyo"],
  design: ["sekkei"],
  spec: ["sekkei"],
  visual: ["sekkei", "eigyo"],
  sales: ["eigyo"],
  eigyo: ["eigyo"],
  genba: ["genba"],
  backoffice: ["keiei"],
  basic: ["keiei", "fudosan", "eigyo", "sekkei", "genba"],
};

export const persons: { id: PersonId; label: string; role: string }[] = [
  { id: "abe", label: "阿部さん", role: "社長／新築注文・建売・仕入れ" },
  { id: "takanashi", label: "高梨さん", role: "現場管理・設計提案" },
  { id: "hayami", label: "早見さん", role: "現場管理・積算" },
  { id: "ono", label: "小野さん", role: "買取再販・リノベ営業" },
  { id: "kojima", label: "小嶋さん", role: "設計・デザイン" },
  { id: "yamaguchi", label: "山口さん", role: "リノベ営業" },
  { id: "all", label: "全員", role: "共通" },
];

export const pains: { id: PainId; label: string }[] = [
  { id: "jitan", label: "時短したい" },
  { id: "bunshou", label: "文章が苦手" },
  { id: "zero", label: "ゼロから作るのが大変" },
  { id: "hinshitsu", label: "品質を上げたい" },
  { id: "shirabe", label: "調べ物が多い" },
  { id: "visual", label: "画像・ビジュアル" },
  { id: "shiryo", label: "顧客に見せる資料" },
  { id: "shikumi", label: "仕組み化・自動化" },
];

/** プロンプトの職種（roleTags 優先、なければ category から導出） */
export const promptRoles = (p: Prompt): RoleId[] => p.roleTags ?? categoryRoles[p.category];

export const categoryLabel = (id: CategoryId) => categories.find((c) => c.id === id)!;
export const personLabel = (id: PersonId) => persons.find((p) => p.id === id)!;
export const painLabel = (id: PainId) => pains.find((p) => p.id === id)!;
export const roleLabel = (id: RoleId) => roles.find((r) => r.id === id)!;

/**
 * 活用頻度・要望の高さ（=おすすめ度）。1=🔥人気（最上位表示）/ 2=★よく使う。
 * 初期値は阿部さんNotion＋キックオフ要望（ChatGPTパース・マイソク・議事録）を根拠に設定。
 * 将来はアクセス実測や社内アンケートで補正する。ここを編集するだけで並び順が変わる。
 */
export const priorityRank: Record<string, 1 | 2> = {
  // 🔥 人気（トップ表示）
  "visual-shinchiku-gaikan": 1,
  "visual-shinchiku-naikan": 1,
  "visual-reform-after": 1,
  "visual-tochi-hamekomi": 1,
  "visual-staging-request": 1,
  "sales-maisoku-info": 1,
  "sales-maisoku-gpt": 1,
  "eigyo-gijiroku-tsugi": 1,
  "shiire-satei-mojiokoshi": 1,
  "basic-kata": 1,
  // ★ よく使う
  "visual-naikan-perse": 2,
  "visual-gaiheki-shitsukan": 2,
  "visual-concept-board": 2,
  "visual-staging-fixed": 2,
  "sales-maisoku-html": 2,
  "sales-tochi-onesheet": 2,
  "sales-tateuri-hansoku": 2,
  "eigyo-teian-slide": 2,
  "eigyo-hearing-sheet": 2,
  "eigyo-shinchiku-teian": 2,
  "research-souba-yomikata": 2,
  "spec-heibei-hiroi": 2,
  "back-seikyu-pdf": 2,
  "basic-kabeuchi": 2,
  "basic-tool-select": 2,
};

/** ソート用ランク（未設定は 9=通常） */
export const promptRank = (id: string): number => priorityRank[id] ?? 9;

/** 「まず使う3本」— 新規メンバーの入口（パース／マイソク／AI基礎の3本柱） */
export const quickStartIds: string[] = [
  "visual-reform-after",
  "sales-maisoku-info",
  "basic-kata",
];

/** ツールフィルタの選択肢 */
export const toolFilters: { id: "chatgpt" | "claude"; label: string; icon: string }[] = [
  { id: "chatgpt", label: "ChatGPT", icon: "🖼️" },
  { id: "claude", label: "Claude", icon: "📝" },
];
