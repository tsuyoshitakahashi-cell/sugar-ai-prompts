# SUGAR AIプロンプト集 — プロジェクト憲法（CLAUDE.md）

最終更新: 2026-07-18

> Next.js のバージョン注意については @AGENTS.md も参照（コードを書く前に確認）。

---

## 1. これは何か

Sugar株式会社（藤沢・住宅／不動産／リノベーション・6名）の全社員向け **AIプロンプト集Webサイト**。
NotionをあまりSUGAR側が見ないため、参考サイト [koumuten-ai-prompt320](https://koumuten-ai-prompt300.vercel.app/) と同型のサイトをVercelで公開し、URLを渡すだけで「探す → コピー → `{ }` を自社・物件情報に置換 → AIに送信」で日常業務を時短できる状態を作った。

- **公開URL（完全公開）**: https://sugar-ai-prompts.vercel.app
- **GitHub**: https://github.com/tsuyoshitakahashi-cell/sugar-ai-prompts （public・`main` push で Vercel 自動デプロイ）
- **オーナー**: 高橋 剛（SHO-SAN）／クライアント: Sugar株式会社
- 関連: 親フォルダ `04.AI派遣_SUGAR/`（SUGAR案件全体）、上位の会社憲法 `AI Campany/CLAUDE.md`

---

## 2. 技術スタック / 構成

- Next.js 16 (App Router) / React 19 / TypeScript / Tailwind CSS v4
- **完全静的（SSG）・DBなし・認証なし**。クライアント側でフィルタ/検索

```
src/
├─ app/
│  ├─ layout.tsx        # メタデータ・フォント（Noto Sans JP）
│  ├─ page.tsx          # ヘッダー / ダークヒーロー / 専用ツール枠 / フッター
│  └─ globals.css       # ブランド配色（ティール brand-*）・{}ハイライト(.ph)
├─ components/
│  ├─ PromptExplorer.tsx  # 左サイドバー（検索・お気に入り・ファセット絞り込み）＋グリッド
│  └─ PromptCard.tsx      # カード（使う時/用意/できる・★・コピー・ChatGPT/Claude起動）
└─ data/
   ├─ types.ts          # Prompt / Flagship 型
   ├─ taxonomy.ts       # categories(10) / persons(7) / pains(7)
   ├─ prompts.ts        # ★プロンプト本体（ここを増やす）
   └─ flagship.ts       # 専用ツール（Claude Code等）の紹介枠
```

---

## 3. データモデル（Prompt）

`src/data/types.ts` の `Prompt` 型。プロンプト追加は `src/data/prompts.ts` の配列に足すだけ。

| フィールド | 内容 |
|---|---|
| `id` | 一意なkebab-case |
| `title` | カード見出し |
| `when` | **使う時**（どんな場面で使うか） |
| `prepare` | **用意**（AIに渡す材料） |
| `output` | **できる**（得られる成果物） |
| `category` | 業務カテゴリ1つ（taxonomyの10種） |
| `personTags` | 担当者（複数可） |
| `painTags` | お悩みタグ（複数可・AND絞り込み対象） |
| `tool` | `chatgpt` / `claude` / `both`（起動ボタン制御） |
| `body` | プロンプト本文。`{ }`＝差し替え箇所、`【 】`＝見出し |
| `note?` | 注意書き（カードに ! で表示） |

### 分類（taxonomy.ts）
- **業務カテゴリ（主軸・10）**: 仕入れ・査定 / リサーチ・エリア分析 / 設計・プランニング / 見積・仕様書 / パース・画像生成 / 販売・集客 / 営業・接客 / 現場管理 / バックオフィス・経営 / AI活用の基本
- **担当者（副軸）**: 阿部(社長) / 高梨 / 早見 / 小野 / 小嶋 / 山口 / 全員
- **お悩みタグ**: 時短したい / 文章が苦手 / ゼロから作るのが大変 / 品質を上げたい / 調べ物が多い / 画像・ビジュアル / 顧客に見せる資料

---

## 4. プロンプト作成の品質基準（厳守）

`body` は次の構造で書く：**役割 → 入力（{ }で明示）→ 手順 → 出力形式 → ガードレール**。

ガードレールに必ず含める観点：
- **数値・法規・品番は「要確認」**（AIの記憶は最新でない）。金額・税率・借入可否などを断定させない
- **曖昧語（高品質・丁寧・好立地・最高 等）を禁止**し、具体（数字・固有名詞・向き・距離）で書かせる
- **不明点は推測で埋めず確認**させる／入力にない事実を創作させない
- **誇大・優良誤認・断定的な金融/投資助言をさせない**

`when/prepare/output` も必ず埋める（カードの「使う時/用意/できる」に表示される）。

---

## 5. ⚠️ 公開前の絶対ルール：個人情報・機密を載せない

**完全公開サイト**のため、プロンプトは再利用可能なテンプレートに徹する。以下は必ず `{ }` プレースホルダ化：
- 担当者の**個人携帯・個人メール**（→ `{担当者名}`『{担当電話}』『{担当メール}`）
- **実案件の固有名詞**（顧客名・物件住所・取得/成約価格 など）
- 会社名・本社住所・代表URL（`sugar-renovation.jp`）は公開情報なので可

**push前の必須チェック**：
```bash
grep -nE "080-|090-|@sugar-renovation|辻|松本|山岡|デュークス|クレアコート|サンクタス|明石町|グレーシア|0[0-9]{1,3}-[0-9]{2,4}-[0-9]{3,4}" src/data/*.ts
```
何も出なければOK。

---

## 6. 開発・デプロイ

```bash
npm run dev     # http://localhost:3000
npm run build   # 本番ビルド（静的生成）
```

- デプロイ: `main` へ push → Vercel 自動デプロイ（team: tsuyoshi-takahashi-4965's projects）
- 本番反映後は https://sugar-ai-prompts.vercel.app を実機確認（フィルタ・件数・コピー・お気に入り）
- 破壊的操作（`git push --force` / `main` 履歴上書き）はしない。UI/コンテンツ変更は build 成功＋個人情報grep を通してから push

---

## 7. これまでの経緯（メモ）

- 2026-07-18 v1公開（56本・左右上部チップUI）→ 同日 v2 に刷新：参考サイト型の**左サイドバー＋ファセット件数＋お気に入り（localStorage）**、カードに**使う時/用意/できる**、全56本を上記品質基準で書き直し
- Vercel MCPトークンはプロジェクト作成権限なし。デプロイは GitHub 連携（push）で行う
- 今後の候補: 本数拡充（56→300目標）／右サイドバー化・ソート機能／独自ドメイン
