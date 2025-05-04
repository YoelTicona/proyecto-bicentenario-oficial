/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
      unoptimized: true, //  esto evita el error de next/image
    },
  };
  
  module.exports = nextConfig;
