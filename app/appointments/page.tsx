"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

interface Appointment {
  id: string;
  date: string;
  status: string;
  patient: { name: string };
  doctor: { name: string };
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token"); // JWT stored in localStorage

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    setLoading(true);
    const res = await fetch("/api/appointments", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setAppointments(data.appointments);
    setLoading(false);
  }

  async function cancelAppointment(id: string) {
    await fetch("/api/appointments", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ appointmentId: id }),
    });
    fetchAppointments();
  }

  async function updateAppointment(id: string) {
    const newDate = prompt("Enter new date (YYYY-MM-DDTHH:MM):");
    if (!newDate) return;

    await fetch("/api/appointments", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ appointmentId: id, date: newDate }),
    });
    fetchAppointments();
  }

  return (
    <div className="flex">
      <Sidebar role="DOCTOR" />
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-semibold mb-6">Appointments</h2>
        {loading ? (
          <p>Loading...</p>
        ) : appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <div className="grid gap-4">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">
                    Patient: {apt.patient?.name || "N/A"}
                  </p>
                  <p className="text-gray-500">
                    Date: {new Date(apt.date).toLocaleString()}
                  </p>
                  <p className="text-gray-500">Status: {apt.status}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateAppointment(apt.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => cancelAppointment(apt.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
