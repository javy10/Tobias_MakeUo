import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configuración para Windows/OneDrive
  experimental: {
    // Optimizar para sistemas de archivos lentos
    optimizeCss: false,
  },
  // Configuración de webpack simplificada para estabilidad
  webpack: (config, { dev, isServer }) => {
    // Configuración específica para Windows/OneDrive
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      };
    }
    
    // Optimizar para sistemas de archivos lentos
    config.snapshot = {
      ...config.snapshot,
      managedPaths: [/^(.+?[\\/]node_modules[\\/])(.+)$/],
    };

    // Configuración para evitar timeouts de chunks
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
        },
      },
    };

    // Ignorar warnings de Genkit/Handlebars
    config.ignoreWarnings = [
      /require\.extensions is not supported by webpack/,
      /Critical dependency: the request of a dependency is an expression/,
    ];
    
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'prlxicaxkpctkksmlnax.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Configuración para manejar mejor los errores de imágenes
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Configuración específica para Supabase (ya incluida en remotePatterns)
    // Deshabilitar optimización para Supabase temporalmente
    unoptimized: false,
    // Configuración de loader personalizado para Supabase
    loader: 'default',
    // Timeout más largo para imágenes
    minimumCacheTTL: 60,
    // Configuración de formato
    formats: ['image/webp', 'image/avif'],
  },
  // Configuración para manejar timeouts
  serverExternalPackages: ['@supabase/supabase-js'],
  // Configuración de headers para mejorar la conectividad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/css/(.*)',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/css',
          },
        ],
      },
    ];
  },
};



export default nextConfig;
