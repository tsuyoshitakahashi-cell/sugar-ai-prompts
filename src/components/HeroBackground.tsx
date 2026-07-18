import Image from "next/image";

/**
 * ヒーロー背景。Sugar様の施工写真を差し込むだけでクロスフェード＋Ken Burnsのスライドショーになる。
 *
 * 写真の入れ方（届いたら）:
 *  1. public/hero/ に WebP を配置（1.webp 〜 4.webp・横長・目安 1600×900px / 各 150〜250KB）
 *  2. 下の HERO_IMAGES に { src, alt } を追加するだけ
 *  3. 4枚以外にする場合は globals.css の heroFade（1周28秒/1枚7秒）を枚数に合わせて調整
 *
 * 写真が0枚のあいだは、海を思わせるティール→ネイビーの微動グラデーションが自動で表示される。
 */
const HERO_IMAGES: { src: string; alt: string }[] = [
  { src: "/hero/1.webp", alt: "Sugarの施工事例：インダストリアル×木の温もりのLDK" },
  { src: "/hero/2.webp", alt: "Sugarの施工事例：レザーソファでくつろぐリビング" },
  { src: "/hero/3.webp", alt: "Sugarの施工事例：サーフボードを飾った湘南らしいリビング" },
  { src: "/hero/4.webp", alt: "Sugarの施工事例：勾配天井と梁が印象的な開放的なLDK" },
];

export default function HeroBackground() {
  const hasPhotos = HERO_IMAGES.length > 0;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* ベース：海イメージのグラデーション（常に最下層。写真の読み込み中も崩れない） */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0d3b4a] to-brand-700" />
      {!hasPhotos && (
        <div
          className="hero-drift absolute inset-0 opacity-70 [background:radial-gradient(60%_80%_at_20%_15%,rgba(76,192,180,0.35),transparent_60%),radial-gradient(70%_90%_at_85%_90%,rgba(31,138,127,0.4),transparent_55%),radial-gradient(50%_60%_at_60%_40%,rgba(120,200,220,0.18),transparent_60%)]"
        />
      )}

      {/* 写真スライドショー（クロスフェード＋Ken Burns） */}
      {HERO_IMAGES.map((img, i) => (
        <div
          key={img.src}
          className="hero-slide absolute inset-0"
          style={{ animationDelay: `${i * 7}s` }}
        >
          <div className="absolute inset-0">
            <Image
              src={img.src}
              alt={img.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>
      ))}

      {/* 可読性オーバーレイ：左を濃く（テキスト側）→右を明るく＋下フェード */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/65 to-slate-950/35" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/70 to-transparent" />
    </div>
  );
}
