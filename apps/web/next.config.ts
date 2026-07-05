import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Mock property/agent images used by the AI dashboard's simulated
    // search results (services/ai/mockProperties.ts) — replace with real
    // Supabase Storage URLs once Property Management (Phase 5) exists.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
    ],
  },
};

export default nextConfig;
