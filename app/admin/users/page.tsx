"use client";

import { useState } from "react";

export default function ManageUsersPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("DOCTOR");
  const [message, setMessage] = useState("");

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Failed to create user");
        return;
      }

      setMessage(`${role} account created successfully!`);
      setName("");
      setEmail("");
      setPassword("");
    } catch {
      setMessage("Something went wrong");
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Manage Users</h2>
      {message && <p className="mb-2 text-blue-600">{message}</p>}
      <form onSubmit={handleCreateUser} className="space-y-3 max-w-md">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Temporary Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="DOCTOR">Doctor</option>
          <option value="PHARMACY">Pharmacy</option>
        </select>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded"
        >
          Create User
        </button>
      </form>
    </div>
  );
}
