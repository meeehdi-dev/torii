import { getCache, setCache } from "./cache";

export async function fetchApi<T>(
  input: string,
  init?: RequestInit & { cacheDuration?: number }
): Promise<T | undefined> {
  try {
    const cacheKey = `remix_${process.env.API_URL}${input}`;
    const xUuid = (init?.headers as Headers | undefined)?.get("x-uuid") ?? null;
    const cached = await getCache(cacheKey, xUuid);
    if (cached) {
      return cached as T;
    }

    const res = await fetch(`${process.env.API_URL}${input}`, init);

    if (res.ok) {
      let data: T;
      if (res.headers.get("content-type")?.startsWith("application/json")) {
        data = (await res.json()) as T;
      } else {
        data = (await res.text()) as T;
      }

      if (init?.cacheDuration) {
        setCache(cacheKey, data, {
          duration: init.cacheDuration,
          uuid: xUuid,
        });
      }

      return data;
    }
    throw await res.text();
  } catch (err) {
    console.error(err);
    return undefined;
  }
}
