// app/patient/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchDoctors } from "@/lib/api";
import DoctorCard from "@/components/DoctorCard";

export default function PatientDashboard() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors()
      .then((data) => setDoctors(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading doctors...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Doctors</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {doctors.map((doc) => (
          <DoctorCard key={doc.id} id={doc.id} name={doc.name} specialization={doc.specialization} />
        ))}
      </div>
    </div>
  );
}
