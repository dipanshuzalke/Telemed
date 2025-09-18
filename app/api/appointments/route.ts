import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate, AuthenticatedUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await authenticate(req);

  if ("error" in user) return user; // not logged in
  const authUser = user as AuthenticatedUser;

  if (authUser.role !== "PATIENT") {
    return NextResponse.json({ error: "Only patients can book appointments" }, { status: 403 });
  }

  try {
    const { doctorId, date } = await req.json();

    if (!doctorId || !date) {
      return NextResponse.json({ error: "doctorId and date are required" }, { status: 400 });
    }

    // Ensure doctor exists
    const doctor = await prisma.user.findUnique({
      where: { id: doctorId, role: "DOCTOR" },
    });
    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    // Save appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientId: authUser.id,
        doctorId,
        date: new Date(date), // convert ISO string from datetime-local
        status: "PENDING", // default status
      },
    });

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (err: any) {
    console.error("Error booking appointment:", err);
    return NextResponse.json({ error: "Failed to book appointment" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const patientId = searchParams.get("patientId");
  const doctorId = searchParams.get("doctorId");

  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        ...(patientId ? { patientId } : {}),
        ...(doctorId ? { doctorId } : {}),
      },
      include: {
        patient: { select: { id: true, name: true, email: true } },
        doctor: { select: { id: true, name: true, email: true } },
      },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}
