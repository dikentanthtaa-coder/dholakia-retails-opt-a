"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { resolveImageUrl } from "@/lib/media";
import blurManifest from "@/lib/media-blur.json";

const BLUR = blurManifest as Record<string, string>;

const DEFAULT_BLUR =
  "data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAACwAQCdASoQABAABABoJYwCdADcy8xAAP7w3fBJ6y/xTHzkHzyOeJz/8Qz/Ivf+suH/HTd4cdD2WSgvSHgAAA==";

/**
 * <HeroVideo> — perceived-instant cinematic video.
 *
 * Flow:
 *   1. First paint shows the poster as a real <Image> with `placeholder="blur"`
 *      and (for hero=true) `priority`. This is the LCP candidate, so the user
 *      sees a high-quality still immediately — no flash of gradient.
 *   2. The <video> element is mounted but not loaded until the section enters
 *      the viewport (IntersectionObserver). preload="none" keeps it off the
 *      critical request path.
 *   3. Once metadata is loaded, the video fades over the poster (200ms) and
 *      starts playing. When the section scrolls offscreen we pause it.
 *
 * This gives the smoothness of a hero video without the bandwidth/render-block
 * cost of treating it as a synchronous asset.
 */

type Props = {
  src: string;
  webmSrc?: string;
  posterImageId: string;
  posterImageSrc?: string;
  alt: string;
  className?: string;
  rawTone?: boolean;
  darkOverlay?: "none" | "subtle" | "strong" | "cinematic";
  /** When true, the poster preloads with priority (hero LCP candidate). */
  priority?: boolean;
  /**
   * Responsive `sizes` for the poster `<Image>`. Defaults to `100vw`, which is
   * correct for full-bleed heroes but wasteful when the video pane only
   * occupies half the viewport (e.g. split-screen sections). Pass an accurate
   * `sizes` string from those callers so Next.js can pick a smaller srcset
   * entry — this is what the Next.js dev-mode warning is asking for.
   */
  sizes?: string;
};

const EDITORIAL_FILTER =
  "grayscale(0.45) contrast(1.05) brightness(0.78) saturate(0.7) hue-rotate(-5deg)";

const OVERLAY_BY_STRENGTH: Record<NonNullable<Props["darkOverlay"]>, string> = {
  none: "transparent",
  subtle:
    "linear-gradient(180deg, rgba(11,20,38,0.18) 0%, rgba(11,20,38,0.28) 100%)",
  strong:
    "linear-gradient(180deg, rgba(11,20,38,0.40) 0%, rgba(11,20,38,0.55) 100%)",
  cinematic:
    "linear-gradient(180deg, rgba(11,20,38,0.60) 0%, rgba(11,20,38,0.30) 50%, rgba(11,20,38,0.70) 100%)",
};

export default function HeroVideo({
  src,
  webmSrc,
  alt,
  className = "",
  rawTone = false,
  darkOverlay = "cinematic",
  posterImageId,
  posterImageSrc,
  priority = false,
  sizes = "100vw",
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [playable, setPlayable] = useState(false);
  const [errored, setErrored] = useState(false);
  const [skipVideo, setSkipVideo] = useState(false);

  const posterUrl = posterImageSrc
    ?? resolveImageUrl({ id: posterImageId }, 1920, 75);
  const posterBlur = (posterImageSrc && BLUR[posterImageSrc]) || DEFAULT_BLUR;

  // Skip video entirely when the user has signalled they want less data or
  // motion: Save-Data, slow effective-type (2g/slow-2g/3g), or
  // prefers-reduced-motion. The poster image alone covers the visual.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reducedMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    type NetworkInformation = {
      saveData?: boolean;
      effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
    };
    const nav = navigator as Navigator & { connection?: NetworkInformation };
    const conn = nav.connection;
    const saveData = conn?.saveData === true;
    const slowNetwork =
      conn?.effectiveType === "slow-2g" ||
      conn?.effectiveType === "2g" ||
      conn?.effectiveType === "3g";

    if (reducedMotion || saveData || slowNetwork) setSkipVideo(true);
  }, []);

  // Lazy-load the video: only when its container is within 200px of the viewport.
  // Also pauses + resumes based on visibility.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (skipVideo) return;
    const wrap = wrapperRef.current;
    if (!wrap) return;

    const loadObs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShouldLoad(true);
            loadObs.disconnect();
          }
        }
      },
      { rootMargin: "200px" }
    );
    loadObs.observe(wrap);
    return () => loadObs.disconnect();
  }, [skipVideo]);

  useEffect(() => {
    if (!shouldLoad) return;
    const node = ref.current;
    if (!node) return;
    const playObs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) node.play().catch(() => {});
          else node.pause();
        }
      },
      { threshold: 0.1 }
    );
    playObs.observe(node);
    return () => playObs.disconnect();
  }, [shouldLoad]);

  return (
    <div ref={wrapperRef} className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Poster — always rendered, faded out once the video can play. */}
      <Image
        src={posterUrl}
        alt={alt}
        fill
        sizes={sizes}
        {...(priority
          ? { preload: true as const, fetchPriority: "high" as const, loading: "eager" as const }
          : { loading: "eager" as const })}
        placeholder="blur"
        blurDataURL={posterBlur}
        className={[
          "object-cover transition-opacity duration-300",
          playable && !errored ? "opacity-0" : "opacity-100",
          className,
        ].join(" ")}
        style={rawTone ? undefined : { filter: EDITORIAL_FILTER }}
      />

      {/* Video — only rendered once in or near viewport; otherwise we save the
          decode/bandwidth cost entirely. */}
      {shouldLoad && !errored && (
        <video
          ref={ref}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={posterUrl}
          aria-label={alt}
          aria-hidden
          className={[
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
            playable ? "opacity-100" : "opacity-0",
            className,
          ].join(" ")}
          style={rawTone ? undefined : { filter: EDITORIAL_FILTER }}
          onCanPlay={() => setPlayable(true)}
          onError={() => setErrored(true)}
        >
          {webmSrc && <source src={webmSrc} type="video/webm" />}
          <source src={src} type="video/mp4" />
        </video>
      )}

      {!rawTone && darkOverlay !== "none" && (
        <span
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: OVERLAY_BY_STRENGTH[darkOverlay] }}
        />
      )}
    </div>
  );
}
