import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://esm.sh https://cdn.esm.sh",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://cdn.jsdelivr.net https://esm.sh https://cdn.esm.sh",
      "worker-src 'self' blob:",
      "frame-src https://www.youtube-nocookie.com",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  async redirects() {
    const localePrefixes = ['/fr', '/en'];
    const pathMap: [string, string][] = [
      ['a-propos', 'about'],
      ['mentions-legales', 'legal'],
      ['profil', 'profile'],
      ['cgv', 'terms'],
      ['shutdown', 'bios'],
      ['projects', 'projets'],
      ['shop', 'boutique'],
      ['softwares', 'logiciels'],
    ];
    const redirects: { source: string; destination: string; permanent: boolean }[] = [
      { source: '/fr/admin/events/scenes', destination: '/fr/admin/animations', permanent: false },
      { source: '/en/admin/events/scenes', destination: '/en/admin/animations', permanent: false },
    ];
    for (const prefix of localePrefixes) {
      for (const [oldPath, newPath] of pathMap) {
        redirects.push({
          source: `${prefix}/${oldPath}`,
          destination: `${prefix}/${newPath}`,
          permanent: true,
        });
        redirects.push({
          source: `${prefix}/${oldPath}/:path*`,
          destination: `${prefix}/${newPath}/:path*`,
          permanent: true,
        });
      }
    }
    return redirects;
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        source: "/fonts/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "*" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
