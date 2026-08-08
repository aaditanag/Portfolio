import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Spline scenes from prod.spline.design
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "unsafe-none",
          },
        ],
      },
    ];
  },
  // Suppress punycode deprecation warning (from npm deps, not our code)
  experimental: {},
};

export default nextConfig;
