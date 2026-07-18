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
  summary: string;
  category: CategoryId;
  personTags: PersonId[];
  painTags: PainId[];
  tool: Tool;
  body: string;
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
