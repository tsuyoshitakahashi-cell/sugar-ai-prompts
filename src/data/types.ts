export type CategoryId =
  | "shiire"
  | "research"
  | "design"
  | "spec"
  | "visual"
  | "sales"
  | "eigyo"
  | "genba"
  | "backoffice"
  | "basic";

export type PersonId =
  | "abe"
  | "takanashi"
  | "hayami"
  | "ono"
  | "kojima"
  | "yamaguchi"
  | "all";

export type PainId =
  | "jitan"
  | "bunshou"
  | "zero"
  | "hinshitsu"
  | "shirabe"
  | "visual"
  | "shiryo";

export type Tool = "chatgpt" | "claude" | "both";

export type Prompt = {
  id: string;
  title: string;
  /** 使う時：どんな場面で使うか */
  when: string;
  /** 用意：AIに渡す材料 */
  prepare: string;
  /** できる：出力として得られるもの */
  output: string;
  category: CategoryId;
  personTags: PersonId[];
  painTags: PainId[];
  tool: Tool;
  /** プロンプト本文（{ } は自社・物件情報の差し替え箇所） */
  body: string;
  /** 注意書き（! で表示） */
  note?: string;
};

export type Flagship = {
  id: string;
  title: string;
  description: string;
  tool: string;
  href?: string;
  hrefLabel?: string;
};
