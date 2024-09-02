import { Buckets } from "@/components/buckets";
import { Ping } from "@/components/ping";
import { Users } from "@/components/users";
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
    </main>
  );
}
