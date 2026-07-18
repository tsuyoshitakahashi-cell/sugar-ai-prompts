import type { CategoryId, PersonId, PainId } from "./types";

export const categories: { id: CategoryId; label: string; icon: string; desc: string }[] = [
  { id: "shiire", label: "仕入れ・査定", icon: "🔑", desc: "買取価格試算・査定コメント・仲介への打診" },
  { id: "research", label: "リサーチ・エリア分析", icon: "🔎", desc: "相場・ハザード・周辺環境・ペルソナ・コンセプト" },
  { id: "design", label: "設計・プランニング", icon: "📐", desc: "間取り改善・コンセプト・仕上げ方針・素材選定" },
  { id: "spec", label: "見積・仕様書", icon: "📋", desc: "品番調べ・仕上げ表・見積チェック・仕様説明" },
  { id: "visual", label: "パース・画像生成", icon: "🎨", desc: "バーチャルステージング・リフォーム後イメージ・内観外観パース" },
  { id: "sales", label: "販売・集客", icon: "📣", desc: "マイソク・物件紹介文・ポータル/SNS・キャッチコピー" },
  { id: "eigyo", label: "営業・接客", icon: "🤝", desc: "反響対応・追客・ヒアリング・提案書・ローン説明" },
  { id: "genba", label: "現場管理", icon: "🔨", desc: "工程表・職人手配・進捗報告・注意喚起・近隣挨拶" },
  { id: "backoffice", label: "バックオフィス・経営", icon: "🗂️", desc: "請求書集計・原価管理・議事録・マニュアル化・メール" },
  { id: "basic", label: "AI活用の基本", icon: "🧭", desc: "プロンプトの型・画像修正の指示・壁打ち・要約" },
];

export const persons: { id: PersonId; label: string; role: string }[] = [
  { id: "abe", label: "阿部さん", role: "社長・新築建売" },
  { id: "takanashi", label: "高梨さん", role: "現場管理" },
  { id: "hayami", label: "早見さん", role: "現場管理" },
  { id: "ono", label: "小野さん", role: "買取再販・リノベ" },
  { id: "kojima", label: "小嶋さん", role: "設計・工事管理" },
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
];

export const categoryLabel = (id: CategoryId) => categories.find((c) => c.id === id)!;
export const personLabel = (id: PersonId) => persons.find((p) => p.id === id)!;
export const painLabel = (id: PainId) => pains.find((p) => p.id === id)!;
