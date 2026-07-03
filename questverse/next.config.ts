import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // QuestVerse: Web-based treasure-hunting puzzle game
  // See docs/GDD.md for game design
  experimental: {
    // For game state optimization
  },
  // Allow game assets
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
