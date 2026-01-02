const nextConfig = {
  // Config updated to trigger rebuild
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ["192.168.0.105", "192.168.0.113", "192.168.0.102"],
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
    proxyClientMaxBodySize: '100mb',
  },
};

export default nextConfig;
