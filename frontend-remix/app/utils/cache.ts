import { createClient } from "redis";

const client = createClient({
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASS,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
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

interface CacheOptions {
  duration: number;
  uuid: string | null;
}

const getKey = (key: string, cookie: string | null): string => {
  return `${key}${cookie ? `_${cookie}` : ""}`;
};

export async function getCache(key: string, cookie: string | null) {
  const data = await client.get(getKey(key, cookie));
  return data ? JSON.parse(data).value : undefined;
}

export function setCache(
  key: string,
  value: unknown,
  { duration, uuid }: CacheOptions
) {
  client.set(getKey(key, uuid), JSON.stringify({ value }), {
    EX: duration,
  });
}
