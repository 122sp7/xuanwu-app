import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "genkit",
    "@genkit-ai/google-genai",
    "@emnapi/core",
    "@emnapi/wasi-threads",
    "@napi-rs/wasm-runtime",
  ],
  // Turbopack is the default in Next.js 16; declare an empty config to
  // acknowledge this and silence the "webpack config with no turbopack config"
  // build error.  The worker_threads browser fallback is handled by listing
  // heavy native packages in serverExternalPackages above so they are never
  // bundled for the client.
  turbopack: {},
};

export default nextConfig;
