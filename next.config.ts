import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  serverExternalPackages: ['pdfjs-dist', 'canvas', 'mammoth', 'docx', 'xlsx'],
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
};

export default nextConfig;
