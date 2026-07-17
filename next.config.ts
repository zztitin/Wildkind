import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages does not provide the Workers Images binding used by
  // Vinext's optimizer. Keep images responsive while serving source assets
  // directly so the same build works on both hosting targets.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
