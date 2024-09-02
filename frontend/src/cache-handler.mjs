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

// TODO: replace with Redis
/** @type {Map<string, any>} */
const cache = new Map();

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
    console.log("get cache", cacheKey);
    return cache.get(`nextjs_${cacheKey}`);
  }

  /**
   * @param {string} pathname
   * @param {import("next/dist/server/response-cache").IncrementalCacheValue} data
   * @param {{tags: string[]}} ctx
   * @return {Promise<void>}
   */
  async set(pathname, data, ctx) {
    console.log("set cache", pathname);
    cache.set(`nextjs_${pathname}`, {
      value: data,
      lastModified: Date.now(),
      tags: ctx.tags,
    });
  }

  /**
   * @param {string | string[]} tags
   * @return {Promise<void>}
   */
  async revalidateTag(tags) {
    if (!Array.isArray(tags)) {
      tags = [tags];
    }
    for (let tag of tags) {
      const entries = Object.entries(cache);
      for (let [key, value] of entries) {
        if (value.tags.includes(tag)) {
          cache.delete(key);
        }
      }
    }
  }
}
