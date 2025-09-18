// app/components/DoctorCard.tsx
"use client";

import Link from "next/link";

interface DoctorCardProps {
  id: string;
  name: string;
  specialization?: string;
}

export default function DoctorCard({ id, name, specialization }: DoctorCardProps) {
  return (
    <div className="border p-4 rounded shadow-md">
      <h3 className="text-lg font-semibold">{name}</h3>
      {specialization && <p className="text-sm">{specialization}</p>}
      <Link href={`/patient/doctors/${id}`}>
        <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          View Availability
        </button>
      </Link>
    </div>
  );
}
