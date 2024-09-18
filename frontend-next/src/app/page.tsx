import { Buckets } from "@/components/buckets";
import { Ping } from "@/components/ping";
import { Me, Users } from "@/components/users";
import { fetchApi } from "@/utils/api";
import { cookies } from "next/headers";
import { Suspense } from "react";

export default async function Home() {
  return (
    <main>
      <Suspense fallback="pinging...">
        <Ping />
      </Suspense>
      <Suspense fallback="loading users...">
        <Users />
      </Suspense>
      <Suspense fallback="loading me...">
        <Me />
      </Suspense>
      <Suspense fallback="loading buckets...">
        <Buckets />
      </Suspense>
      <form
        action={async (formData) => {
          "use server";

          const uuid = await fetchApi<{ uuid: string }>("/v1/login", {
            method: "POST",
            body: formData,
          });
          if (uuid?.uuid) {
            cookies().set({
              value: uuid.uuid,
              name: "nextjs_session",
            });
          }
        }}
      >
        <input type="email" name="email" />
        <button type="submit">Se connecter</button>
      </form>
    </main>
  );
}
