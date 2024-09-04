export async function fetchApi<T>(
  input: string,
  init?: RequestInit,
): Promise<T | undefined> {
  try {
    if (process.env.NEXT_PHASE == "phase-production-build") {
      if (!init) {
        init = {};
      }
      if (!init.next) {
        init.next = {};
      }
      init = { ...init, next: { ...init.next, revalidate: 0 } };
    }

    const res = await fetch(`${process.env.API_URL}${input}`, init);
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
