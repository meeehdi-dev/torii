import { createCookie, createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno

type SessionData = {
  uuid: string;
};

export const userSession = createCookieSessionStorage<SessionData>({
  cookie: createCookie("remix_session"),
});
