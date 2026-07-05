import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Mock property/agent images used by services/ai/mockProperties.ts
      // and the landing page's featured listings.
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      // Real property photos — signed URLs from the private `property-media`
      // Storage bucket (see propertyMediaUrl.ts).
      { protocol: "https", hostname: "paixdssdoguuyanoyroj.supabase.co", pathname: "/storage/v1/object/sign/**" },
    ],
  },
};

export default nextConfig;
