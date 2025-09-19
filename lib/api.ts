// app/services/api.ts
const BASE_URL = "http://192.168.29.220:3000/api"; // backend URL

export async function fetchDoctors() {
  const res = await fetch(`${BASE_URL}/doctors`);
  if (!res.ok) throw new Error("Failed to fetch doctors");
  return res.json();
}

export async function fetchDoctorAvailability(doctorId: string) {
  const token = localStorage.getItem("token");

  const res = await fetch(`/api/availability?doctorId=${doctorId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // ✅ attach token
    },
  });

  if (!res.ok) throw new Error("Failed to fetch availability");
  return res.json();
}

export async function bookAppointment(doctorId: string, date: string) {
  const res = await fetch("/api/appointments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, // 👈 send token
    },
    body: JSON.stringify({ doctorId, date }),
  });

  if (!res.ok) throw new Error("Failed to book appointment");
  return res.json();
}

export async function fetchPatientAppointments(patientId: string) {
  const res = await fetch(`/api/appointments/patient/${patientId}`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch appointments");
  }

  return res.json();
}

export async function fetchDoctorAppointments(doctorId: string) {
  const res = await fetch(`/api/appointments/doctor/${doctorId}`);
  if (!res.ok) throw new Error("Failed to fetch doctor appointments");
  return res.json();
}

