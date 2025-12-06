import { getUsers } from "@/src/actions/user-action"
import { LoginForm } from "../_components/login-form"

const LoginPage = async () => {

  const users = await getUsers();

  return (
    <>
      <LoginForm />
      <>
      {users.map(user => (
        <div key={user.id}>
          <p>{user.email}</p>
        </div>
      ))}
      </>
    </>
  )
}

export default LoginPage