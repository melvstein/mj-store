import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: false,
    devIndicators: false,
    images: {
        remotePatterns: [
        {
            protocol: "https",
            hostname: "lh3.googleusercontent.com",
        },
        ],
    },
};

export default nextConfig;
