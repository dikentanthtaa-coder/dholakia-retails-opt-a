"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { EASE_STANDARD } from "@/lib/motion";

type Props = {
  image: { src: string; alt: string; blurDataURL?: string } | null;
  children: React.ReactNode;
};

/** News detail hero — Hero3LayerParallax + image scale 1.04 → 1.0 / 1.4s. */
export default function NewsHero({ image, children }: Props) {
  const ref = useRef<HTMLElement>(null);
  const layerImg = useRef<HTMLDivElement>(null);
  const layerOverlay = useRef<HTMLDivElement>(null);
  const layerType = useRef<HTMLDivElement>(null);

  useMouseParallax(
    ref,
    [
      { ref: layerImg, amplitude: 15 },
      { ref: layerOverlay, amplitude: 5, counter: true },
      { ref: layerType, amplitude: 8, counter: true },
    ],
    { duration: 0.6, ease: "power2.out" }
  );

  return (
    <section ref={ref} data-header-theme="dark" className="relative w-full overflow-hidden text-white" style={{ height: "75vh", minHeight: 520 }}>
      {/* Layer 1 — image (scale 1.04 → 1.0) */}
      <motion.div
        ref={layerImg}
        aria-hidden
        className="absolute inset-[-3%]"
        initial={{ scale: 1.04, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: EASE_STANDARD }}
      >
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="100vw"
            placeholder={image.blurDataURL ? "blur" : "empty"}
            blurDataURL={image.blurDataURL}
            className="object-cover"
            priority
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(70% 80% at 35% 45%, #2a3a5c 0%, #14213d 50%, #060B17 100%)",
            }}
          />
        )}
      </motion.div>

      {/* Layer 2 — overlay */}
      {/* <motion.div
        ref={layerOverlay}
        aria-hidden
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="absolute inset-x-0 bottom-0 h-3/4"
          style={{
            background:
              "linear-gradient(to top, rgba(6,11,23,0.85) 0%, rgba(6,11,23,0.35) 50%, rgba(6,11,23,0) 100%)",
          }}
        />
      </motion.div> */}
      <div className="absolute inset-0 bg-linear-to-b from-[#0B1426]/80 via-[#0B1426]/30 to-[#0B1426]" />
      <div className="absolute inset-0 bg-linear-to-r from-[#0B1426]/80 via-transparent to-transparent" />



      {/* Layer 3 — typography */}
      <div
        ref={layerType}
        className="relative z-10 h-full container-editorial flex items-end pb-16 md:pb-20 pt-32"
      >
        <div className="max-w-3xl">{children}</div>
      </div>
    </section>
  );
}
