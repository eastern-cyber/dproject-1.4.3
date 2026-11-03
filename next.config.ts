// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Environment variables exposed to the client ─────────────────────────
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },

  // ── Build tolerances (kept from next.config.js) ─────────────────────────
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ── Remote images for token icons on /member-area ───────────────────────
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "polygonscan.com",
        pathname: "/token/images/**",
      },
      {
        protocol: "https",
        hostname: "ipfs.io",
        pathname: "/ipfs/**",
      },
    ],
  },

  // ── Webpack tweaks to silence known third-party warnings ────────────────
  webpack: (config) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { IgnorePlugin } = require("webpack");

    // Suppress thread-stream warning (WalletConnect / pino logger dependency)
    config.plugins.push(
      new IgnorePlugin({
        resourceRegExp: /[\\/]thread-stream[\\/]/,
      })
    );

    // Ignore optional x402 subpath imports from @coinbase/cdp-sdk
    // (pulled in transitively by thirdweb's Base Account wallet)
    config.plugins.push(
      new IgnorePlugin({
        resourceRegExp: /^@x402\/(core|evm|svm)\//,
      })
    );

    return config;
  },
};

export default nextConfig;