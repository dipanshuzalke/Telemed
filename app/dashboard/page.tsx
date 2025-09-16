import Sidebar from "@/components/Sidebar";
import { useUser } from "@/context/UserContext";

export default function DashboardPage() {
  const { user } = useUser();

  if (!user) return <p>Loading...</p>; // Or redirect to login

  return (
    <div className="flex">
      {(user.role === "DOCTOR" || user.role === "PHARMACY" || user.role === "ADMIN") ? (
        <Sidebar role={user.role} />
      ) : (
        <div className="p-6 text-red-500">Access denied: Invalid role</div>
      )}
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-semibold mb-6">Welcome, {user.name}</h2>
        <p>Your role: {user.role}</p>
        {/* Add dashboard cards here */}
      </div>
    </div>
  );
}
