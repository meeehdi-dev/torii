import { fetchApi } from "@/utils/api";
import { cookies } from "next/headers";
import { FC } from "react";

interface UserProps {
  id: number;
  email: string;
}

const User: FC<UserProps> = ({ id, email }) => (
  <div>
    <span>ID: {id}</span>
    <span>, </span>
    <span>Email: {email}</span>
  </div>
);

export const Users: FC = async () => {
  const users = await fetchApi<{ users: { id: number; email: string }[] }>(
    "/v1/users",
    {
      next: { revalidate: 60 },
    },
  );

  return (
    <div>
      <hr />
      <h2>Users</h2>
      {users ? (
        users.users.map((user) => <User key={user.id} {...user} />)
      ) : (
        <div>[]</div>
      )}
    </div>
  );
};

export const Me: FC = async () => {
  const uuid = cookies().get("nextjs_session")?.value;

  const me = await fetchApi<{ user: { id: number; email: string } }>(
    "/v1/user/me",
    {
      next: { revalidate: 60 },
      headers: {
        "x-uuid": uuid ?? "",
      },
    },
  );

  return (
    <div>
      <hr />
      <h2>Me</h2>
      {me ? <User {...me.user} /> : <div>null</div>}
      <hr />
    </div>
  );
};
