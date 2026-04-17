/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prisma v7 + libsql : exclure du bundling Webpack côté serveur
  experimental: {
    serverExternalPackages: ["@prisma/client", "@prisma/adapter-libsql", "@libsql/client"],
  },

  // Ignore ESLint et TypeScript errors pendant le build de production
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // Optimisation images
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
};

export default nextConfig;
