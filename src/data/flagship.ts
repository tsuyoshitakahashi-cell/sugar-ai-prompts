import type { Flagship } from "./types";

// コピペ対象外。SUGAR様向けに構築済みの「専用ツール」を導線として紹介する枠。
export const flagships: Flagship[] = [
  {
    id: "spec-engine",
    title: "内装仕様書 自動生成",
    description:
      "物件フォルダ（仕上表Excel＋平面図＋メーカーPDF）を渡すだけで、クロス・建具・電気設備を1冊にした内装仕様書PPTXを自動生成。深夜の手貼り作業をゼロに。Claude Codeで構築済み。",
    tool: "Claude Code 専用ツール",
    hrefLabel: "使い方・引き継ぎ資料を見る",
  },
  {
    id: "souba-skill",
    title: "相場リサーチ（成約価格）",
    description:
      "「大船駅・中古マンション・築20〜40年」のように条件を伝えるだけで、国土交通省 不動産情報ライブラリの成約価格データをAIが自動取得し、価格帯・中央値・㎡単価・代表事例までサマリー。Claude Code×公式APIで規約クリア。",
    tool: "Claude Code 専用ツール",
    hrefLabel: "使い方を見る",
  },
  {
    id: "staging-system",
    title: "バーチャルステージング プロンプト生成システム",
    description:
      "平面図・家具プラン・室内写真を渡すと、ChatGPTでの家具合成用プロンプトを自動で組み立てるシステム。「写る家具／写らない家具」まで平面図基準で指定。固定プロンプトはGoogleドキュメントで管理。",
    tool: "Claudeプロジェクト＋ChatGPT",
    hrefLabel: "システムを開く",
  },
];
