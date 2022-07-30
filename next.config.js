/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["nicovideo.cdn.nimg.jp"],
  },
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
