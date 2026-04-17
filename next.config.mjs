/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prisma v7 + libsql : exclure du bundling Webpack côté serveur
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-libsql", "@libsql/client"],

  // Optimisation images Unsplash
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
