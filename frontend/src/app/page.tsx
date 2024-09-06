import { Buckets } from "@/components/buckets";
import { Ping } from "@/components/ping";
import { Users } from "@/components/users";
import { fetchApi } from "@/utils/api";
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
      <Suspense fallback="loading buckets...">
        <Buckets />
      </Suspense>
      <form
        action={async (formData) => {
          "use server";

          await fetchApi<{ session: number }>("/v1/login", {
            method: "POST",
            body: formData,
          });
        }}
      >
        <input type="email" name="email" />
        <button type="submit">Se connecter</button>
      </form>
    </main>
  );
}
