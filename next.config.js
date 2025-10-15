/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output standalone pour Docker
  output: 'standalone',

  // Performance
  compress: true,
  poweredByHeader: false,

  // TypeScript strict
  typescript: {
    tsconfigPath: './tsconfig.json'
  },

  // ESLint pendant le build
  eslint: {
    dirs: ['app', 'components', 'lib', 'utils']
  },

  // Images optimisées
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 an
  },

  // Experimental features Next.js 15
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // Headers de sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  }
};

module.exports = nextConfig;