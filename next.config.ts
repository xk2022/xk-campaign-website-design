import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  poweredByHeader: false,
  allowedDevOrigins: ["127.0.0.1"],
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  ...(process.env.STATIC_EXPORT === "true"
    ? {
        output: "export" as const,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};
export default nextConfig;
