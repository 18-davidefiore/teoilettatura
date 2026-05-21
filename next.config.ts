import withPWA from "next-pwa";

const nextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  allowedDevOrigins: ["localhost", "100.108.195.2"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**.supabase.co" }]
  }
};

const enablePwa = process.env.NEXT_PWA === "true";

export default enablePwa
  ? withPWA({
      dest: "public",
      register: true,
      skipWaiting: true,
      buildExcludes: [/middleware-manifest\\.json$/]
    })(nextConfig)
  : nextConfig;
