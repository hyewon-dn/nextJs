import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  // serverRuntimeConfig: {
  //   apiBaseURL: process.env.API_BASE_URL,
  // },
  // publicRuntimeConfig: {
  //   apiBaseUrl: process.env.API_BASE_URL,
  // },
  // experimental: {
  //   serverActions: {
  //     bodySizeLimit: '50mb',
  //   },
  // },
  // api: {
  //   bodyParser: {
  //     sizeLimit: '50mb', // Increase from default
  //   },
  // },
  // async redirects() {
  //   return [
  //     {source: '/', destination: '/service-introduction', permanent: true},
  //   ];
  // },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/:path*',
  //       destination: `${process.env.API_BASE_URL}/:path*`, // 실제 API 주소
  //     },
  //   ];
  // },
  compiler: {
    styledComponents: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

export default nextConfig;
