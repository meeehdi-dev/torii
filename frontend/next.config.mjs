import { resolve } from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  cacheHandler: resolve("./src/cache-handler.mjs"),
  cacheMaxMemorySize: 0,
};

export default nextConfig;
