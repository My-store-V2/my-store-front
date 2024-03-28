/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "127.0.0.1",
            process.env.NEXT_PUBLIC_BACKEND_URL,
            'my-store-files.s3.eu-west-3.amazonaws.com',
            'my-store-files.s3.eu-wst-3.amazonaws.com'
        ],
        
    },
}

module.exports = nextConfig
