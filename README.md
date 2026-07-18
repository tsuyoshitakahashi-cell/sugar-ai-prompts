# SUGAR AIプロンプト集

Sugar株式会社（藤沢・住宅／不動産／リノベーション）の全社員向け AIプロンプト集サイト。
「探す → コピー → `{ }` を自社・物件情報に置換して AI に送信」で日常業務を時短するための、業務カテゴリ別プロンプト集です。

参考: 工務店向け [koumuten-ai-prompt300](https://koumuten-ai-prompt300.vercel.app/) の同型（SUGAR様専用版）。

## 技術スタック

- Next.js 16 (App Router) / React 19 / TypeScript
- Tailwind CSS v4
- 完全静的（SSG）・DBなし・認証なし → Vercel にそのままデプロイ

## ディレクトリ

```
src/
├─ app/
│  ├─ layout.tsx        # メタデータ・フォント
│  ├─ page.tsx          # ヘッダー/ヒーロー/使い方/専用ツール枠/フッター
│  └─ globals.css       # ブランド配色（ティール）・{}ハイライト
├─ components/
│  ├─ PromptExplorer.tsx  # フィルタ（カテゴリ/担当者/お悩みAND）＋検索
│  └─ PromptCard.tsx      # 全文コピー・ChatGPT/Claude起動・{}ハイライト
└─ data/
   ├─ types.ts          # Prompt / 型定義
   ├─ taxonomy.ts       # 業務カテゴリ・担当者・お悩みタグの定義
   ├─ prompts.ts        # ★プロンプト本体（ここを増やす）
   └─ flagship.ts       # 専用ツール（Claude Code等）の紹介枠
```

## プロンプトの追加・編集

`src/data/prompts.ts` の配列に追記するだけ。フィールド:

| 項目 | 説明 |
|---|---|
| `id` | 一意なkebab-case |
| `title` / `summary` | カード見出し・一言説明 |
| `category` | 業務カテゴリ（`taxonomy.ts` の10種から1つ） |
| `personTags` | 担当者（複数可） |
| `painTags` | お悩みタグ（複数可・AND絞り込み対象） |
| `tool` | `chatgpt` / `claude` / `both`（起動ボタン制御） |
| `body` | プロンプト本文。差し替え箇所は `{ }`、見出しは【 】 |
| `note` | 使い方のコツ（任意） |

### ⚠️ 公開前の必須ルール（このサイトは完全公開）

- **個人情報を本文に直書きしない**：担当者の携帯・個人メールは `{担当者名}`『{担当電話}』等のプレースホルダに
- **実案件の固有名詞を載せない**：顧客名・物件住所・取得/成約価格 など
- 会社名・本社住所・代表URL（公式サイトで公開済み）は可

漏れ検査:
```bash
grep -nE "080-|090-|@sugar-renovation|[0-9]{2,4}-[0-9]{3,4}" src/data/*.ts
```

## 開発

```bash
npm run dev     # http://localhost:3000
npm run build   # 本番ビルド（静的生成）
```

## デプロイ

GitHub `main` への push で Vercel が自動デプロイ（Vercel プロジェクト連携後）。

---
Powered by SHO-SAN
