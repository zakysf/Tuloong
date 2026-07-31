import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // CORS proxy: forward /api requests ke Laravel backend selama development
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
