import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb', // Aumente conforme necessário
    },
  },

  
};

export default nextConfig;
