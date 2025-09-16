"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

interface Prescription {
  id: string;
  medication: string;
  patient: { name: string };
  doctor: { name: string };
  pharmacy?: { name: string };
  createdAt: string;
}

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPrescription, setNewPrescription] = useState({
    patientId: "",
    medication: "",
    pharmacyId: "",
  });

  const token = localStorage.getItem("token"); // JWT stored

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  async function fetchPrescriptions() {
    setLoading(true);
    const res = await fetch("/api/prescriptions", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPrescriptions(data.prescriptions);
    setLoading(false);
  }

  async function createPrescription() {
    if (!newPrescription.patientId || !newPrescription.medication) return alert("Fill all fields");

    await fetch("/api/prescriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(newPrescription),
    });
    setNewPrescription({ patientId: "", medication: "", pharmacyId: "" });
    fetchPrescriptions();
  }

  return (
    <div className="flex">
      <Sidebar role="DOCTOR" />
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-semibold mb-6">Prescriptions</h2>

        {/* Create Prescription Form (Doctors only) */}
        <div className="bg-white p-4 rounded-xl shadow-md mb-6">
          <h3 className="font-medium mb-2">New Prescription</h3>
          <div className="flex gap-4 flex-wrap">
            <input
              type="text"
              placeholder="Patient ID"
              value={newPrescription.patientId}
              onChange={(e) => setNewPrescription({ ...newPrescription, patientId: e.target.value })}
              className="border p-2 rounded-lg flex-1"
            />
            <input
              type="text"
              placeholder="Medication"
              value={newPrescription.medication}
              onChange={(e) => setNewPrescription({ ...newPrescription, medication: e.target.value })}
              className="border p-2 rounded-lg flex-1"
            />
            <input
              type="text"
              placeholder="Pharmacy ID (optional)"
              value={newPrescription.pharmacyId}
              onChange={(e) => setNewPrescription({ ...newPrescription, pharmacyId: e.target.value })}
              className="border p-2 rounded-lg flex-1"
            />
            <button
              onClick={createPrescription}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </div>

        {/* Prescriptions List */}
        {loading ? (
          <p>Loading...</p>
        ) : prescriptions.length === 0 ? (
          <p>No prescriptions found.</p>
        ) : (
          <div className="grid gap-4">
            {prescriptions.map((presc) => (
              <div
                key={presc.id}
                className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">Patient: {presc.patient?.name || "N/A"}</p>
                  <p className="text-gray-500">Doctor: {presc.doctor?.name || "N/A"}</p>
                  <p className="text-gray-500">Medication: {presc.medication}</p>
                  <p className="text-gray-500">Pharmacy: {presc.pharmacy?.name || "N/A"}</p>
                  <p className="text-gray-400 text-sm">
                    Created: {new Date(presc.createdAt).toLocaleString()}
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
