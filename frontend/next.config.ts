import type { NextConfig } from "next";

// Backend reachable from THIS machine (the Next.js server process), not from the visitor's device.
const backendInternalUrl = process.env.BACKEND_INTERNAL_URL || "http://localhost:4000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${backendInternalUrl}/api/:path*` },
    ];
  },
};

export default nextConfig;
