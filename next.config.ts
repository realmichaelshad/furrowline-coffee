import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep dev overlays out of screenshots and recordings.
  devIndicators: false,
  // Don't write tool-instruction files into the project folder.
  agentRules: false,
  // Local captures and QA hit the dev server on 127.0.0.1.
  allowedDevOrigins: ["127.0.0.1"],
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    // AVIF first (25-50% smaller than WebP at the same visual quality), WebP as the fallback.
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
    // Fewer widths: shorter srcsets in the HTML/RSC payload and better cache reuse.
    deviceSizes: [640, 828, 1080, 1440, 1920, 2560],
    imageSizes: [96, 128, 160, 256, 384],
  },
  // Security headers live here only; vercel.json keeps just the static-asset cache rule.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
