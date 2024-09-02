export async function fetchApi<T>(
  input: string,
  init?: RequestInit,
): Promise<T | undefined> {
  try {
    // TODO: force revalidate 0 at build time
    const res = await fetch(`${process.env.API_URL}${input}`, init);
    console.log(res.headers.get("content-type"))
    if (res.ok) {
      if (res.headers.get("content-type")?.startsWith("application/json")) {
        return res.json() as T;
      } else {
        return res.text() as T;
      }
    }
    throw await res.text();
  } catch (err) {
    console.error(err);
    return undefined;
  }
}
