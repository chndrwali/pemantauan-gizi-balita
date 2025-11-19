// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin');

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // experimental: {
  //   turbopackFileSystemCacheForDev: true,
  // },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }
    return config;
  },
};

export default nextConfig;
