import type { NextConfig } from "next";

/**
 * Static export for a brochure site.
 * Served at domain root (/) — never use basePath on Vercel.
 * outputDirectory is "out" (see vercel.json).
 */
const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
};

export default nextConfig;
