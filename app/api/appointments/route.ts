import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticate } from "@/lib/auth";

// GET all appointments for the logged-in user
export async function GET(req: Request) {
  const authResult = authenticate(req as any);
  if (authResult instanceof NextResponse) return authResult;

  const { userId, role } = authResult;

  let appointments;
  if (role === "PATIENT") {
    appointments = await prisma.appointment.findMany({
      where: { patientId: userId },
      include: { patient: true, doctor: true },
      orderBy: { date: "desc" },
    });
  } else if (role === "DOCTOR") {
    appointments = await prisma.appointment.findMany({
      where: { doctorId: userId },
      include: { patient: true, doctor: true },
      orderBy: { date: "desc" },
    });
  } else {
    appointments = await prisma.appointment.findMany({
      include: { patient: true, doctor: true },
      orderBy: { date: "desc" },
    });
  }

  return NextResponse.json({ appointments });
}

// POST: Book a new appointment
export async function POST(req: Request) {
  const authResult = authenticate(req as any);
  if (authResult instanceof NextResponse) return authResult;

  const { userId, role } = authResult;
  const body = await req.json();
  const { doctorId, date } = body;

  if (role !== "PATIENT") {
    return NextResponse.json({ error: "Only patients can book appointments" }, { status: 403 });
  }

  const appointment = await prisma.appointment.create({
    data: {
      patientId: userId,
      doctorId,
      date: new Date(date),
    },
  });

  return NextResponse.json({ appointment }, { status: 201 });
}

// PATCH: Update appointment (reschedule or status)
export async function PATCH(req: Request) {
  const authResult = authenticate(req as any);
  if (authResult instanceof NextResponse) return authResult;

  const { userId, role } = authResult;
  const { appointmentId, date, status } = await req.json();

  // Only patient who booked or doctor assigned can update
  const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
  if (!appointment) return NextResponse.json({ error: "Appointment not found" }, { status: 404 });

  if (userId !== appointment.patientId && userId !== appointment.doctorId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const updated = await prisma.appointment.update({
    where: { id: appointmentId },
    data: { date: date ? new Date(date) : undefined, status },
  });

  return NextResponse.json({ appointment: updated });
}

// DELETE: Cancel appointment
export async function DELETE(req: Request) {
  const authResult = authenticate(req as any);
  if (authResult instanceof NextResponse) return authResult;

  const { userId, role } = authResult;
  const { appointmentId } = await req.json();

  const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
  if (!appointment) return NextResponse.json({ error: "Appointment not found" }, { status: 404 });

  if (userId !== appointment.patientId && userId !== appointment.doctorId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await prisma.appointment.delete({ where: { id: appointmentId } });
  return NextResponse.json({ message: "Appointment cancelled" });
}
