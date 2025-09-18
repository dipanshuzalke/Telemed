"use client";

import { useEffect, useState } from "react";

type Availability = {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  createdAt: string;
};

export default function DoctorAvailabilityManager() {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [message, setMessage] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  // Fetch doctor availabilities
  const fetchAvailabilities = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/availability", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAvailabilities(data.availabilities);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAvailabilities();
  }, []);

  // Add new availability
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const res = await fetch("/api/availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ day, startTime, endTime }),
      });

      if (res.ok) {
        setMessage("Availability added!");
        setDay("");
        setStartTime("");
        setEndTime("");
        fetchAvailabilities();
      } else {
        const data = await res.json();
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    }
  };

  // Update availability
  const handleUpdate = async (id: string) => {
    const newStart = prompt("Enter new start time (HH:MM)");
    const newEnd = prompt("Enter new end time (HH:MM)");
    if (!newStart || !newEnd || !token) return;

    try {
      const res = await fetch(`/api/availability/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ startTime: newStart, endTime: newEnd }),
      });
      if (res.ok) {
        setMessage("Availability updated!");
        fetchAvailabilities();
      } else {
        const data = await res.json();
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    }
  };

  // Delete availability
  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!confirm("Are you sure you want to delete this slot?")) return;

    try {
      const res = await fetch(`/api/availability/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMessage("Availability deleted!");
        fetchAvailabilities();
      } else {
        const data = await res.json();
        setMessage(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Manage Availability</h2>
      {message && <p className="mb-4 text-red-600">{message}</p>}

      {/* Add new */}
      <form onSubmit={handleAdd} className="mb-6 space-y-2">
        <select
          value={day}
          onChange={(e) => setDay(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Day</option>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
          <option value="Sunday">Sunday</option>
        </select>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Add Slot
        </button>
      </form>

      {/* Existing slots */}
      <h3 className="text-xl font-semibold mb-2">Your Slots</h3>
      <ul>
        {availabilities.map((slot) => (
          <li key={slot.id} className="flex justify-between items-center mb-2 border p-2 rounded">
            <span>{slot.day}: {slot.startTime} - {slot.endTime}</span>
            <div className="space-x-2">
              <button
                onClick={() => handleUpdate(slot.id)}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(slot.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
