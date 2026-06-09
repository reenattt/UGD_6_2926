import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/create-shipment',
        destination: '/manifest',
        permanent: true,
      },
      {
        source: '/shipments/create',
        destination: '/manifest',
        permanent: true,
      },
      {
        source: '/dashboard/create',
        destination: '/manifest',
        permanent: true,
      },
      {
        source: '/shipment/new',
        destination: '/manifest',
        permanent: true,
      },
      {
        source: '/manifest/create',
        destination: '/manifest',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
