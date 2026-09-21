import type { NextConfig } from "next";

/**
 * Vercel-first config. Site is served at the domain root (/).
 * Do NOT set basePath here — that breaks CSS/images on Vercel.
 */
const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
