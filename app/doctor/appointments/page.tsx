"use client";

import { useEffect, useState } from "react";
import { fetchDoctorAppointments } from "@/lib/api";

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const doctorId = "DOCTOR_ID_HERE"; // Replace with logged-in doctor id

  useEffect(() => {
    setLoading(true);
    fetchDoctorAppointments(doctorId)
      .then((data) => setAppointments(data.appointments))
      .catch((err) => {
        console.error(err);
        setAppointments([]);
      })
      .finally(() => setLoading(false));
  }, [doctorId]);

  if (loading) return <p>Loading upcoming appointments...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Upcoming Appointments</h1>
      {appointments.length > 0 ? (
        <div className="space-y-3">
          {appointments.map((appt) => (
            <div key={appt.id} className="border rounded p-3 shadow">
              <p><strong>Patient:</strong> {appt.patient?.name} ({appt.patient?.email})</p>
              <p><strong>Date:</strong> {new Date(appt.appointmentDate).toLocaleString()}</p>
              <p><strong>Status:</strong> {appt.status}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No upcoming appointments.</p>
      )}
    </div>
  );
}
