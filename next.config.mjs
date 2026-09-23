/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },   // required under static export
  reactStrictMode: true,
};
export default nextConfig;
