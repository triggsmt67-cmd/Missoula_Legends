import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === 'development';
const contentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ''};
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://1qfgxo5m8zzr2lsf.public.blob.vercel-storage.com;
  media-src 'self' blob: https://1qfgxo5m8zzr2lsf.public.blob.vercel-storage.com;
  font-src 'self' data:;
  connect-src 'self' https://1qfgxo5m8zzr2lsf.public.blob.vercel-storage.com https://raw.githubusercontent.com;
  worker-src 'self' blob:;
  frame-src 'self' https://maps.google.com https://www.google.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [65, 75],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '1qfgxo5m8zzr2lsf.public.blob.vercel-storage.com',
        pathname: '/**',
      },
    ],
  },
  serverExternalPackages: ['sharp'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: contentSecurityPolicy,
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/articles/trevortruepath406com',
        destination: '/articles/lolo-creek-distillery',
        permanent: true,
      },
      {
        source: '/spotlight',
        destination: '/claim',
        permanent: true,
      },
    ];
  },
};

const payloadConfig = withPayload(nextConfig);
const payloadHeaders = payloadConfig.headers;

// Payload applies color-scheme client hints globally by default. Scope them to
// the admin UI so public pages do not incur a browser restart on first visit.
payloadConfig.headers = async () => {
  const rules = payloadHeaders ? await payloadHeaders() : [];

  return rules.map((rule) =>
    rule.headers.some(({ key }) => key.toLowerCase() === 'critical-ch')
      ? { ...rule, source: '/admin/:path*' }
      : rule
  );
};

export default payloadConfig;
