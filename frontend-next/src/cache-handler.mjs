import { createClient } from "redis";

const client = createClient({
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASS,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    tls: false,
  },
});
client.on("error", (err) => {
  console.error("redis client error", err);
});
client.on("connect", () => {
  console.log("redis client connecting");
});
client.on("reconnecting", () => {
  console.log("redis client reconnecting");
});
client.on("ready", () => {
  console.log("redis client ready");
});
client.on("end", () => {
  console.log("redis client disconnected");
});
client.connect();

export default class RedisCacheHandler {
  /** @type {import("next/dist/server/lib/incremental-cache").CacheHandlerContext} */
  options;

  /**
   * @param {import("next/dist/server/lib/incremental-cache").CacheHandlerContext} options
   */
  constructor(options) {
    this.options = options;
  }

  /** @param {string} cacheKey
   * @returns {Promise<import("next/dist/server/lib/incremental-cache").CacheHandlerValue | null>}
   */
  async get(cacheKey) {
    return JSON.parse(await client.get(`nextjs_${cacheKey}`));
  }

  /**
   * @param {string} pathname
   * @param {import("next/dist/server/response-cache").IncrementalCacheValue} data
   * @param {{tags: string[], revalidate: number | false}} ctx
   * @return {Promise<void>}
   */
  async set(pathname, data, ctx) {
    return client.set(
      `nextjs_${pathname}`,
      JSON.stringify({ value: data, lastModified: Date.now(), tags: ctx.tags }),
      { EX: ctx.revalidate },
    );
  }
}
