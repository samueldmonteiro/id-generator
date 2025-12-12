import { getUsers } from "@/src/actions/user-action";
import { UserClientPage } from "./client-page";

export default async function UsersPage() {
  const result = await getUsers();
  const initialUsers = result.success && result.data ? result.data : [];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <UserClientPage initialUsers={initialUsers} />
    </div>
  );
}
