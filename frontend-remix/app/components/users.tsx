import { FC } from "react";

interface UserProps {
  id: number;
  email: string;
}

export const User: FC<UserProps> = ({ id, email }) => (
  <div>
    <span>ID: {id}</span>
    <span>, </span>
    <span>Email: {email}</span>
  </div>
);

export const Users: FC<{
  users: { users: UserProps[] };
}> = ({ users }) => {
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

export const Me: FC<{
  me: { user: UserProps };
}> = ({ me }) => {
  return (
    <div>
      <hr />
      <h2>Me</h2>
      {me ? <User {...me.user} /> : <div>null</div>}
      <hr />
    </div>
  );
};
