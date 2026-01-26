/** @type {import('next').NextConfig} */
const nextConfig = {
    // Empty object to enable defaults for standard use cases
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    }
}

module.exports = nextConfig
