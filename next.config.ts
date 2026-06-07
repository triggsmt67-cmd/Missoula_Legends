import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '1qfgxo5m8zzr2lsf.public.blob.vercel-storage.com',
        pathname: '/**',
      },
    ],
  },
  serverExternalPackages: ['sharp'],
};

export default withPayload(nextConfig);

