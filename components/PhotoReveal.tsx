"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { asset } from "@/lib/asset";

type Direction = "left" | "right" | "bottom";

type PhotoRevealProps = {
  src: string;
  alt: string;
  direction?: Direction;
  priority?: boolean;
  caption?: ReactNode;
  fit?: "cover" | "contain";
  aspectClassName?: string;
};

const OFFSET: Record<Direction, { x: number; y: number }> = {
  left: { x: -56, y: 0 },
  right: { x: 56, y: 0 },
  bottom: { x: 0, y: 64 },
};

export function PhotoReveal({
  src,
  alt,
  direction = "bottom",
  priority = false,
  caption,
  fit = "cover",
  aspectClassName = "aspect-[4/3] sm:aspect-[16/10]",
}: PhotoRevealProps) {
  const reduceMotion = useReducedMotion();
  const offset = OFFSET[direction];

  return (
    <section className="relative mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <motion.figure
        className="overflow-hidden"
        initial={
          reduceMotion
            ? { opacity: 1, scale: 1, x: 0, y: 0 }
            : { opacity: 0, scale: 1.06, x: offset.x, y: offset.y }
        }
        whileInView={{ opacity: 1, scale: 1, x: 0, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 0.85, ease: [0.22, 1, 0.36, 1] }
        }
      >
        <div className={`relative w-full ${aspectClassName}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset(src)}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className={`absolute inset-0 h-full w-full ${
              fit === "contain" ? "object-contain" : "object-cover"
            }`}
          />
        </div>
        {caption ? (
          <figcaption className="mt-3 text-center text-sm tracking-wide text-[var(--muted)]">
            {caption}
          </figcaption>
        ) : (
          <figcaption className="mt-3 text-center text-sm tracking-wide text-[var(--muted)]">
            {alt}
          </figcaption>
        )}
      </motion.figure>
    </section>
  );
}
