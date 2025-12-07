import { getUsers } from "../actions/user-action";
import { Button } from "../components/ui/button";

export default async function Home() {

  const users = await getUsers();

  return (
    <div className="">
      {users.map(user=>(
        <p key={user.id}>Nome: {user.name}</p>
      ))}
    </div>
  );
}
