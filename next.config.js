/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["page.tsx", "page.ts"],
  images: {
    domains: ["nicovideo.cdn.nimg.jp"],
    disableStaticImages: true,
  },
  swcMinify: true,
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

module.exports = nextConfig;
