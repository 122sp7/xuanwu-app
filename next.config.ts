import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
  serverExternalPackages: [
    "genkit",
    "@genkit-ai/google-genai",
    "@emnapi/core",
    "@emnapi/wasi-threads",
    "@napi-rs/wasm-runtime",
  ],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve = config.resolve ?? {};
      config.resolve.fallback = {
        ...config.resolve.fallback,
        worker_threads: false,
      };
    }
    return config;
  },
};

export default nextConfig;
