import { fetchApi } from "@/utils/api";
import { FC } from "react";

export const Ping: FC = async () => {
  const start = new Date();
  const pong = await fetchApi<string>("/ping", {
    next: { revalidate: 10 },
  });
  const end = new Date();

  return (
    <div>
      ping: {pong} ({end.valueOf() - start.valueOf()} ms)
    </div>
  );
};
