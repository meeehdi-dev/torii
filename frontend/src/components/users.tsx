import { fetchApi } from "@/utils/api";
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
  const [users, user1] = await Promise.all([
    fetchApi<{ users: { id: number; email: string }[] }>("/v1/users", {
      next: { revalidate: 60 },
    }),
    fetchApi<{ user: { id: number; email: string } }>("/v1/user/1", {
      next: { revalidate: 60 },
      credentials: "include",
    }),
  ]);

  return (
    <div>
      <hr />
      <h2>User1</h2>
      {user1 ? <User {...user1.user} /> : <div>null</div>}
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
