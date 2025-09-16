import Link from "next/link";

interface SidebarProps {
  role: "DOCTOR" | "PHARMACY" | "ADMIN";
}

export default function Sidebar({ role }: SidebarProps) {
  return (
    <aside className="w-64 bg-white shadow-md p-6 flex flex-col gap-4 h-screen">
      <Link href="/dashboard" className="font-medium hover:text-blue-500">Dashboard</Link>

      {role === "DOCTOR" && (
        <>
          <Link href="/appointments" className="font-medium hover:text-blue-500">Appointments</Link>
          <Link href="/prescriptions" className="font-medium hover:text-blue-500">Prescriptions</Link>
          <Link href="/records" className="font-medium hover:text-blue-500">Medical Records</Link>
        </>
      )}

      {role === "PHARMACY" && (
        <>
          <Link href="/prescriptions" className="font-medium hover:text-blue-500">Prescriptions</Link>
        </>
      )}

      {role === "ADMIN" && (
        <>
          <Link href="/appointments" className="font-medium hover:text-blue-500">Appointments</Link>
          <Link href="/prescriptions" className="font-medium hover:text-blue-500">Prescriptions</Link>
          <Link href="/records" className="font-medium hover:text-blue-500">Medical Records</Link>
          <Link href="/users" className="font-medium hover:text-blue-500">Users Management</Link>
        </>
      )}
    </aside>
  );
}
