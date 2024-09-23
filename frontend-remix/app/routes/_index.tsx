import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { Await, defer, Form, redirect, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import { Buckets } from "~/components/buckets";
import { Ping } from "~/components/ping";
import { Me, Users } from "~/components/users";
import { userSession } from "~/sessions";
import { fetchApi } from "~/utils/api";

export const meta: MetaFunction = () => {
  return [{ title: "Torii" }, { name: "description", content: "Okaeri!" }];
};

export async function action({ request }: ActionFunctionArgs) {
  const session = await userSession.getSession(request.headers.get("cookie"));

  const formData = await request.formData();

  const action = formData.get("action");

  if (action === "login") {
    // TODO: use jose to sign with secret
    const user = await fetchApi<{ uuid: string }>("/v1/login", {
      method: "post",
      body: formData,
    });

    if (!user) {
      return;
    }

    session.set("uuid", user.uuid);

    return redirect("/", {
      headers: {
        "Set-Cookie": await userSession.commitSession(session),
      },
    });
  } else if (action === "logout") {
    const session = await userSession.getSession(request.headers.get("Cookie"));
    const uuid = session.get("uuid");

    await fetchApi<{ success: boolean }>("/v1/logout", {
      method: "post",
      headers: new Headers({
        "x-uuid": uuid ?? "",
      }),
    });

    return redirect("/", {
      headers: {
        "Set-Cookie": await userSession.destroySession(session),
      },
    });
  }
}

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
    headers: new Headers({
      "x-uuid": uuid ?? "",
    }),
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
    <main className="flex flex-col gap-8 p-8">
      <Suspense fallback="pinging...">
        <Await resolve={dataPromise.pong}>
          {(pong) => <Ping pong={pong} />}
        </Await>
      </Suspense>
      <Suspense fallback="loading me...">
        <Await
          resolve={dataPromise.me}
          errorElement={
            <Form method="post" className="flex gap-4">
              <input type="hidden" name="action" value="login" />
              <input type="email" name="email" />
              <button type="submit">Se connecter</button>
            </Form>
          }
        >
          {(me) => <Me me={me} />}
        </Await>
      </Suspense>
      <Suspense fallback="loading users...">
        <Await resolve={dataPromise.users}>
          {(users) => <Users users={users} />}
        </Await>
      </Suspense>
      <Suspense fallback="loading buckets...">
        <Await resolve={dataPromise.buckets}>
          {(buckets) => <Buckets buckets={buckets} />}
        </Await>
      </Suspense>
    </main>
  );
}
