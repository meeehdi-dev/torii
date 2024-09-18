import { ActionFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { userSession } from "~/sessions";
import { fetchApi } from "~/utils/api";

export const meta: MetaFunction = () => {
  return [{ title: "Torii" }, { name: "description", content: "Okaeri!" }];
};

export async function action({ request }: ActionFunctionArgs) {
  const session = await userSession.getSession(request.headers.get("cookie"));

  const formData = await request.formData();
  const user = await fetchApi<{ uuid: string }>("/v1/login", {
    method: "post",
    body: formData,
  });

  console.log("login", user);

  if (!user) {
    return;
  }

  session.set("uuid", user.uuid);

  return redirect("/", {
    headers: {
      "Set-Cookie": await userSession.commitSession(session),
    },
  });
}

export default function Index() {
  return (
    <Form method="post">
      <input type="email" name="email" />
      <button type="submit">Se connecter</button>
    </Form>
  );
}
