import { getUser } from "@/src/lib/dal"

const DashboardPage = async () => {

  const user = await getUser();

  return (
    <div>{user?.name}</div>
  )
}

export default DashboardPage