import type { Prompt } from "@/data/types";

function legacyCopy(text: string) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
}

export async function copyText(text: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
  } catch {
    // Clipboard API が権限等で拒否された場合は execCommand にフォールバック
  }
  legacyCopy(text);
}

export function Highlighted({ body }: { body: string }) {
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

export const toolBadge: Record<string, string> = {
  chatgpt: "ChatGPT",
  claude: "Claude",
  both: "ChatGPT / Claude",
};

export const toolUrl = {
  chatgpt: "https://chatgpt.com/",
  claude: "https://claude.ai/new",
} as const;

export type ToolKey = keyof typeof toolUrl;

export function toolsOf(prompt: Prompt): ToolKey[] {
  return prompt.tool === "both" ? ["chatgpt", "claude"] : [prompt.tool];
}
