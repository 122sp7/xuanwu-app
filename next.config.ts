import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
  serverExternalPackages: ["genkit", "@genkit-ai/google-genai"],
};

export default nextConfig;
