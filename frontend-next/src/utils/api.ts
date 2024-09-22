import { cookies, headers } from "next/headers";

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
    } else if (init?.credentials === "include") {
      if (!init.headers) {
        init.headers = {};
      }
      const clientHeaders = headers();
      const forwardedHeaders = Object.fromEntries(
        Array.from(clientHeaders.entries()).filter(
          ([name]) => name === "cookie",
        ),
      );
      init = { ...init, headers: { ...forwardedHeaders, ...init.headers } };
    }

    const res = await fetch(`${process.env.API_URL}${input}`, init);

    const setCookie = res.headers.getSetCookie();
    if (setCookie.length > 0) {
      setCookie.map((cookieStr) => {
        let cookieName = "";
        let cookieValue = "";
        const cookieObj = Object.fromEntries(
          cookieStr.split("; ").map((part, index) => {
            const [name, value] = part.split("=");

            // first part is the cookie itself
            if (index === 0) {
              cookieName = name;
              cookieValue = value;
            }

            return [name, value ?? "true"];
          }),
        );
        if (!cookieName || !cookieValue) {
          // skip if cookie name or value empty
          return;
        }

        const cookie = {
          name: cookieName,
          value: cookieValue,
          path: cookieObj.Path,
          domain: cookieObj.Domain,
          maxAge: cookieObj["Max-Age"]
            ? Number(cookieObj["Max-Age"])
            : undefined,
          httpOnly: cookieObj["HttpOnly"] === "true",
          sameSite:
            (cookieObj["SameSite"] as "strict" | "lax" | "none" | undefined) ??
            "strict",
          secure: cookieObj.Secure === "true",
        };

        cookies().set(cookie);
      });
    }
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
