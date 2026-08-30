import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    // tree-shake framer-motion so only the pieces we use ship
    optimizePackageImports: ["framer-motion"],
  },
  async headers() {
    return [
      {
        // photos and the OG card never change without a rename
        source: "/:path(photos/.*|og\\.png)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
