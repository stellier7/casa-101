import type { NextConfig } from "next";

/** Standard Next.js config for Vercel — do not set outputDirectory to "out". */
const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
