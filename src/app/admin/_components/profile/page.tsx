import { getCurrentUser } from "@/lib/actions/admin-actions";
import UpdateUserForm from "./_components/UpdateUserForm";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <UpdateUserForm user={user} />
    </div>
  );
}