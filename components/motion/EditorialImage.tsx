import Image from "next/image";
import type { CSSProperties } from "react";
import { unsplashUrl } from "@/lib/media";
import blurManifest from "@/lib/media-blur.json";

// Inline a tiny 8×8 cool-tone WebP so any image without a baked LQIP still
// gets a smooth-fade-in instead of a flash of background gradient.
const DEFAULT_BLUR =
  "data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAACwAQCdASoQABAABABoJYwCdADcy8xAAP7w3fBJ6y/xTHzkHzyOeJz/8Qz/Ivf+suH/HTd4cdD2WSgvSHgAAA==";

const BLUR: Record<string, string> = blurManifest as Record<string, string>;

const EDITORIAL_FILTER =
  "grayscale(0.55) contrast(1.1) brightness(0.78) saturate(0.65) hue-rotate(-8deg)";

const OVERLAY_BY_STRENGTH = {
  none: "transparent",
  subtle:
    "linear-gradient(180deg, rgba(11,20,38,0.18) 0%, rgba(11,20,38,0.28) 100%)",
  strong:
    "linear-gradient(180deg, rgba(11,20,38,0.40) 0%, rgba(11,20,38,0.55) 100%)",
  cinematic:
    "linear-gradient(180deg, rgba(11,20,38,0.60) 0%, rgba(11,20,38,0.30) 50%, rgba(11,20,38,0.70) 100%)",
} as const;

type Overlay = keyof typeof OVERLAY_BY_STRENGTH;

type Props = {
  src: { id: string; alt: string; src?: string };
  fill?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
  className?: string;
  wrapperClassName?: string;
  style?: CSSProperties;
  /** When true, image preloads in the document <head> for above-the-fold heroes. */
  priority?: boolean;
  /** Force `loading="eager"` for non-priority above-the-fold candidates. */
  eager?: boolean;
  rawTone?: boolean;
  quality?: number;
  alt?: string;
  darkOverlay?: Overlay;
};

/**
 * <EditorialImage> — Server-Component wrapper around next/image.
 *
 * Always renders one of:
 *   • the local committed asset (preferred), or
 *   • an Unsplash thumbnail derived from the registry id.
 *
 * Adds:
 *   • blur-up placeholder from `lib/media-blur.json` (baked at build time).
 *   • the brand cool-tone CSS filter unless `rawTone`.
 *   • an editorial dark-gradient overlay layered on top.
 *
 * The previous error-cascade (state machine flipping through Picsum then
 * gradient) lived in a client component for no measurable benefit — every
 * referenced asset is committed to /public/media. Falling back to a CSS
 * gradient at the parent layer when an asset is genuinely missing is enough
 * and keeps this component server-rendered, which removes ~5 KB of client
 * JS from every page that uses it.
 */
export default function EditorialImage({
  src,
  fill = false,
  sizes = "100vw",
  width,
  height,
  className = "",
  wrapperClassName = "",
  style,
  priority = false,
  eager = false,
  rawTone = false,
  quality = 75,
  alt,
  darkOverlay = "subtle",
}: Props) {
  const hasLocal = Boolean(src.src);
  const targetWidth = width ?? 2400;
  const targetHeight = height ?? Math.round((targetWidth * 9) / 16);

  const url = hasLocal ? (src.src as string) : unsplashUrl(src.id, 2400, quality);
  const blurDataURL = (hasLocal && BLUR[src.src!]) || DEFAULT_BLUR;
  const filterStyle: CSSProperties = rawTone ? {} : { filter: EDITORIAL_FILTER };
  const overlay =
    !rawTone && darkOverlay !== "none" ? OVERLAY_BY_STRENGTH[darkOverlay] : null;

  const loadingProps = priority
    ? ({ preload: true, fetchPriority: "high" as const, loading: "eager" as const })
    : eager
      ? ({ loading: "eager" as const })
      : ({ loading: "lazy" as const });

  if (fill) {
    return (
      <>
        <Image
          src={url}
          alt={alt ?? src.alt}
          fill
          sizes={sizes}
          quality={quality}
          {...loadingProps}
          placeholder="blur"
          blurDataURL={blurDataURL}
          className={["object-cover", className].join(" ")}
          style={filterStyle}
        />
        {overlay && (
          <span
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{ background: overlay }}
          />
        )}
      </>
    );
  }

  return (
    <span
      className={["relative inline-block", wrapperClassName].join(" ")}
      style={{ lineHeight: 0, ...style }}
    >
      <Image
        src={url}
        alt={alt ?? src.alt}
        width={targetWidth}
        height={targetHeight}
        sizes={sizes}
        quality={quality}
        {...loadingProps}
        placeholder="blur"
        blurDataURL={blurDataURL}
        className={className}
        style={filterStyle}
      />
      {overlay && (
        <span
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: overlay }}
        />
      )}
    </span>
  );
}
