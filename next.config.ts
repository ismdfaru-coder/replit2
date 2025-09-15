import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
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
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Configure for Replit environment  
  allowedDevOrigins: [
    'https://54cf2834-6ab0-4280-979a-b666d4fbbedd-00-hcnx6b067ux8.spock.replit.dev',
    'https://*.replit.dev',
    'http://localhost:5000',
    'http://127.0.0.1:5000'
  ],
};

export default nextConfig;
