"use client";

import { useEffect, useRef, useState } from "react";

/**
 * <LazyBackgroundVideo> — bandwidth-aware background video.
 *
 * Designed for decorative full-bleed background loops (the kind we put
 * behind text), NOT for hero LCP video. Differences vs <HeroVideo>:
 *   - No poster image; the parent supplies its own fallback styling
 *     (gradient, solid colour, etc.). This avoids forcing every caller
 *     to ship a separate poster asset.
 *   - Skips the video entirely on Save-Data, slow effective network type
 *     (`slow-2g` / `2g` / `3g`), low downlink, low device memory, or
 *     `prefers-reduced-motion`. The user sees the parent's fallback —
 *     no blank flash, no wasted bytes.
 *   - `preload="none"` and the <video> isn't even mounted until the
 *     section is within ~200px of the viewport (IntersectionObserver).
 *   - Pauses when scrolled offscreen so the decode loop doesn't waste
 *     mobile CPU/GPU cycles when the user can't see it.
 *
 * Drop-in usage:
 *   <LazyBackgroundVideo src="/media/x.mp4" className="..." />
 */

type Props = {
  src: string;
  webmSrc?: string;
  className?: string;
  /** Inline style on the <video>. Filters etc. */
  style?: React.CSSProperties;
  /** Skip on mobile widths regardless of network (heavy assets). */
  skipBelowWidth?: number;
};

export default function LazyBackgroundVideo({
  src,
  webmSrc,
  className = "",
  style,
  skipBelowWidth,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldMount, setShouldMount] = useState(false);
  const [skip, setSkip] = useState(false);

  // Decide whether to load the video at all. Runs once on mount because
  // a returning user on a flaky connection should still get the cheap
  // path, not a snapshot of whatever the network looked like yesterday.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reducedMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    type NetworkInformation = {
      saveData?: boolean;
      effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
      downlink?: number; // Mbps
    };
    type NavigatorWithMemory = Navigator & {
      connection?: NetworkInformation;
      deviceMemory?: number;
    };
    const nav = navigator as NavigatorWithMemory;
    const conn = nav.connection;
    const saveData = conn?.saveData === true;
    const slowNetwork =
      conn?.effectiveType === "slow-2g" ||
      conn?.effectiveType === "2g" ||
      conn?.effectiveType === "3g" ||
      (typeof conn?.downlink === "number" && conn.downlink < 1.5);
    const lowMemory =
      typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2;
    const narrow =
      typeof skipBelowWidth === "number" &&
      window.matchMedia(`(max-width: ${skipBelowWidth - 1}px)`).matches;

    if (reducedMotion || saveData || slowNetwork || lowMemory || narrow) {
      setSkip(true);
    }
  }, [skipBelowWidth]);

  // Mount the <video> only once its container is near the viewport.
  useEffect(() => {
    if (skip) return;
    const wrap = wrapperRef.current;
    if (!wrap || typeof window === "undefined") return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShouldMount(true);
            obs.disconnect();
            break;
          }
        }
      },
      { rootMargin: "200px" }
    );
    obs.observe(wrap);
    return () => obs.disconnect();
  }, [skip]);

  // Pause when offscreen to save CPU/battery.
  useEffect(() => {
    if (!shouldMount) return;
    const node = videoRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) node.play().catch(() => {});
          else node.pause();
        }
      },
      { threshold: 0.05 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [shouldMount]);

  if (skip) {
    // Render the wrapper anyway so layout is identical; just no <video>.
    return <div ref={wrapperRef} aria-hidden className={className} />;
  }

  return (
    <div ref={wrapperRef} aria-hidden className={className}>
      {shouldMount && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover"
          style={style}
        >
          {webmSrc && <source src={webmSrc} type="video/webm" />}
          <source src={src} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
