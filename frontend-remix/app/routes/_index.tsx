import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Await, defer, Link, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { Buckets } from "~/components/buckets";
import { Ping } from "~/components/ping";
import { Me, Users } from "~/components/users";
import { userSession } from "~/sessions";
import { fetchApi } from "~/utils/api";

export const meta: MetaFunction = () => {
  return [{ title: "Torii" }, { name: "description", content: "Okaeri!" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await userSession.getSession(request.headers.get("Cookie"));
  const uuid = session.get("uuid");

  const pong = fetchApi<string>("/ping", {
    cacheDuration: 10,
  });
  const users = fetchApi<{ users: { id: number; email: string }[] }>(
    "/v1/users",
    {
      cacheDuration: 30,
    }
  );
  const me = fetchApi<{ user: { id: number; email: string } }>("/v1/user/me", {
    cacheDuration: 60,
    headers: {
      "x-uuid": uuid ?? "",
    },
  });
  const buckets = fetchApi<{
    buckets: { name: string; creationDate: string }[];
  }>("/v3/files/list", {
    cacheDuration: 30,
  });

  return defer({ pong, users, me, buckets });
}

export default function Index() {
  const dataPromise = useLoaderData<typeof loader>();

  return (
    <div>
      <Suspense fallback="pinging...">
        <Await resolve={dataPromise.pong}>
          {(pong) => <Ping pong={pong} />}
        </Await>
      </Suspense>
      <Suspense fallback="loading users...">
        <Await resolve={dataPromise.users}>
          {(users) => <Users users={users} />}
        </Await>
      </Suspense>
      <Suspense fallback="loading me...">
        <Await resolve={dataPromise.me} errorElement={<div></div>}>
          {(me) => <Me me={me} />}
        </Await>
      </Suspense>
      <Suspense fallback="loading buckets...">
        <Await resolve={dataPromise.buckets}>
          {(buckets) => <Buckets buckets={buckets} />}
        </Await>
      </Suspense>
      <Link to={"/login"}>Login</Link>
    </div>
  );
}
