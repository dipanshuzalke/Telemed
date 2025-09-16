"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

interface MedicalRecord {
  id: string;
  notes: string;
  patient: { name: string };
  doctor?: { name: string };
  appointment?: { date: string };
  createdAt: string;
}

export default function RecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRecord, setNewRecord] = useState({ patientId: "", appointmentId: "", notes: "" });

  const token = localStorage.getItem("token"); // JWT stored

  useEffect(() => {
    fetchRecords();
  }, []);

  async function fetchRecords() {
    setLoading(true);
    const res = await fetch("/api/medical-records", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setRecords(data.records);
    setLoading(false);
  }

  async function createRecord() {
    if (!newRecord.patientId || !newRecord.notes) return alert("Fill all required fields");

    await fetch("/api/medical-records", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(newRecord),
    });
    setNewRecord({ patientId: "", appointmentId: "", notes: "" });
    fetchRecords();
  }

  return (
    <div className="flex">
      <Sidebar role="DOCTOR" />
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-semibold mb-6">Medical Records</h2>

        {/* New Record Form (Doctors Only) */}
        <div className="bg-white p-4 rounded-xl shadow-md mb-6">
          <h3 className="font-medium mb-2">Add Medical Record</h3>
          <div className="flex gap-4 flex-wrap">
            <input
              type="text"
              placeholder="Patient ID"
              value={newRecord.patientId}
              onChange={(e) => setNewRecord({ ...newRecord, patientId: e.target.value })}
              className="border p-2 rounded-lg flex-1"
            />
            <input
              type="text"
              placeholder="Appointment ID (optional)"
              value={newRecord.appointmentId}
              onChange={(e) => setNewRecord({ ...newRecord, appointmentId: e.target.value })}
              className="border p-2 rounded-lg flex-1"
            />
            <textarea
              placeholder="Notes"
              value={newRecord.notes}
              onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
              className="border p-2 rounded-lg flex-1"
            />
            <button
              onClick={createRecord}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Add Record
            </button>
          </div>
        </div>

        {/* Records List */}
        {loading ? (
          <p>Loading...</p>
        ) : records.length === 0 ? (
          <p>No medical records found.</p>
        ) : (
          <div className="grid gap-4">
            {records.map((rec) => (
              <div
                key={rec.id}
                className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">Patient: {rec.patient?.name || "N/A"}</p>
                  <p className="text-gray-500">Doctor: {rec.doctor?.name || "N/A"}</p>
                  <p className="text-gray-500">Appointment: {rec.appointment?.date ? new Date(rec.appointment.date).toLocaleString() : "N/A"}</p>
                  <p className="text-gray-500">Notes: {rec.notes}</p>
                  <p className="text-gray-400 text-sm">
                    Created: {new Date(rec.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
