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
            {
                protocol: "https",
                hostname: "pub-8ac6e188aae64b34b826461f795c7bef.r2.dev",
            },
            {
                protocol: "https",
                hostname: "pub-fbc2f2ff6ae34297ba30cf46f4366a77.r2.dev",
            },
        ],
    },
};

export default nextConfig;
