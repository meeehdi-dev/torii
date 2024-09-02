import { fetchApi } from "@/utils/api";
import { FC } from "react";

export const Ping: FC = async () => {
  const pong = await fetchApi<string>("/ping", {
    next: { revalidate: 10 },
  });

  console.log(pong);

  return <div>ping: {pong}</div>;
};
