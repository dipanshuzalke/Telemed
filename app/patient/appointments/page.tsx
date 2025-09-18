"use client";

import { useEffect, useState } from "react";
import { fetchPatientAppointments } from "@/lib/api";

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const patientId = "PATIENT_ID_HERE"; // Replace with logged-in patient id

  useEffect(() => {
    setLoading(true);
    fetchPatientAppointments(patientId)
      .then((data) => setAppointments(data.appointments))
      .catch((err) => {
        console.error(err);
        setAppointments([]);
      })
      .finally(() => setLoading(false));
  }, [patientId]);

  if (loading) return <p>Loading your appointments...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Appointments</h1>
      {appointments.length > 0 ? (
        <div className="space-y-3">
          {appointments.map((appt) => (
            <div key={appt.id} className="border rounded p-3 shadow">
              <p><strong>Doctor:</strong> {appt.doctor?.name} ({appt.doctor?.specialization})</p>
              <p><strong>Date:</strong> {new Date(appt.appointmentDate).toLocaleString()}</p>
              <p><strong>Status:</strong> {appt.status}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No appointments booked yet.</p>
      )}
    </div>
  );
}
