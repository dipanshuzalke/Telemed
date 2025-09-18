// app/patient/doctors/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchDoctorAvailability, bookAppointment } from "@/lib/api";

export default function DoctorDetail() {
  const { id } = useParams();
  const [availability, setAvailability] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    if (id) {
      const doctorId = Array.isArray(id) ? id[0] : id;
      setLoading(true);
     fetchDoctorAvailability(doctorId)
  .then((data) => setAvailability(data.availabilities || []))
  .catch((err) => {
    console.error(err);
    setAvailability([]);
  })
  .finally(() => setLoading(false));

    }
  }, [id]);

  const handleBook = async () => {
    if (!selectedDate) return alert("Select a date");
    try {
      await bookAppointment(String(id), selectedDate);
      alert("Appointment booked successfully!");
    } catch (err) {
      alert("Failed to book appointment");
      console.error(err);
    }
  };

  if (loading) return <p>Loading availability...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Doctor Availability</h1>
      <div className="flex flex-col gap-2">
        {Array.isArray(availability) && availability.length > 0 ? (
          availability.map((slot) => (
            <div key={slot.id} className="border p-2 rounded">
              <p>{slot.day}</p>
              <p>
                {slot.startTime} - {slot.endTime}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No availability found.</p>
        )}
      </div>

      <div className="mt-4">
        <input type="datetime-local" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="border p-2 rounded mr-2" />
        <button onClick={handleBook} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Book Appointment
        </button>
      </div>
    </div>
  );
}
