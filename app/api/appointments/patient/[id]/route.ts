// pages/api/appointments/patient/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid patient ID" });
  }

  try {
    const appointments = await prisma.appointment.findMany({
      where: { patientId: id },
      include: {
        doctor: {
          select: { id: true, name: true},
        },
      },
      orderBy: { date: "asc" },
    });

    return res.status(200).json({ appointments });
  } catch (error) {
    console.error("Fetch patient appointments error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
