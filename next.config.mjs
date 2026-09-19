/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // static site — hosts on Cloudflare Pages (and Vercel) with no server
  images: { unoptimized: true },
};

export default nextConfig;
