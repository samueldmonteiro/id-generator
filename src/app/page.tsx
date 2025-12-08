import { authServiceFactory } from "../factories/service-factory";

export default async function Home() {

  const users = await authServiceFactory().getUsers();
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>
          <p>Nome: {user.name}</p>
          <p>Email: {user?.email ?? 'nao tem'}</p>
        </div>
      ))}
    </div>
  );
}
