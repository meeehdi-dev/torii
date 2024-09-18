import { FC } from "react";

interface PingProps {
  pong: string;
}

export const Ping: FC<PingProps> = ({ pong }) => {
  return <div>ping: {pong}</div>;
};
