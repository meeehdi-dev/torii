import { fetchApi } from "@/utils/api";
import { cookies } from "next/headers";
import { FC } from "react";

interface UserProps {
  id: number;
  email: string;
}

const User: FC<UserProps> = ({ id, email }) => (
  <div className="flex gap-2 font-thin">
    <span>{email}</span>
    <span className="font-mono text-gray-300 italic">({id})</span>
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
      <h2>Users</h2>
      {users && users.users.length > 0 ? (
        <ul>
          {users.users.map((user) => (
            <li key={user.id}>
              <User {...user} />
            </li>
          ))}
        </ul>
      ) : (
        <div>[]</div>
      )}
    </div>
  );
};

export const Me: FC = async () => {
  const uuid = cookies().get("nextjs_session")?.value;

  if (!uuid) {
    return null;
  }

  const me = await fetchApi<{ user: { id: number; email: string } }>(
    "/v1/user/me",
    {
      next: { revalidate: 60 },
      headers: {
        "x-uuid": uuid ?? "",
      },
    },
  );

  if (!me) {
    return null;
  }

  return (
    <div>
      <h2>Me</h2>
      <User {...me.user} />
    </div>
  );
};
