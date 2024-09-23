import { Form } from "@remix-run/react";
import { FC } from "react";

interface UserProps {
  id: number;
  email: string;
}

export const User: FC<UserProps> = ({ id, email }) => (
  <div className="flex gap-2 font-thin">
    <span>{email}</span>
    <span className="font-mono italic text-gray-300">({id})</span>
  </div>
);

export const Users: FC<{
  users: { users: UserProps[] };
}> = ({ users }) => {
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

export const Me: FC<{
  me: { user: UserProps };
}> = ({ me }) => {
  return (
    <div>
      <h2>Me</h2>
      <User {...me.user} />
      <Form method="post">
        <input type="hidden" name="action" value="logout" />
        <button type="submit">Se déconnecter</button>
      </Form>
    </div>
  );
};
