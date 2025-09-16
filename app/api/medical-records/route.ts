import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticate } from "@/lib/auth";

// GET: Fetch medical records for the logged-in user
export async function GET(req: Request) {
  const authResult = authenticate(req as any);
  if (authResult instanceof NextResponse) return authResult;

  const { userId, role } = authResult;

  let records;
  if (role === "PATIENT") {
    records = await prisma.medicalRecord.findMany({
      where: { patientId: userId },
      include: { doctor: true, patient: true, appointment: true },
      orderBy: { createdAt: "desc" },
    });
  } else if (role === "DOCTOR") {
    records = await prisma.medicalRecord.findMany({
      where: { doctorId: userId },
      include: { doctor: true, patient: true, appointment: true },
      orderBy: { createdAt: "desc" },
    });
  } else {
    // Admin
    records = await prisma.medicalRecord.findMany({
      include: { doctor: true, patient: true, appointment: true },
      orderBy: { createdAt: "desc" },
    });
  }

  return NextResponse.json({ records });
}

// POST: Create a new medical record (Doctor only)
export async function POST(req: Request) {
  const authResult = authenticate(req as any);
  if (authResult instanceof NextResponse) return authResult;

  const { userId, role } = authResult;
  const { patientId, appointmentId, notes } = await req.json();

  if (role !== "DOCTOR") {
    return NextResponse.json({ error: "Only doctors can create medical records" }, { status: 403 });
  }

  const record = await prisma.medicalRecord.create({
    data: {
      patientId,
      doctorId: userId,
      appointmentId,
      notes,
    },
  });

  return NextResponse.json({ record }, { status: 201 });
}

// PATCH: Update a medical record (Doctor only)
export async function PATCH(req: Request) {
  const authResult = authenticate(req as any);
  if (authResult instanceof NextResponse) return authResult;

  const { userId, role } = authResult;
  const { recordId, notes } = await req.json();

  if (role !== "DOCTOR") {
    return NextResponse.json({ error: "Only doctors can update medical records" }, { status: 403 });
  }

  const record = await prisma.medicalRecord.findUnique({ where: { id: recordId } });
  if (!record) return NextResponse.json({ error: "Record not found" }, { status: 404 });

  if (record.doctorId !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const updated = await prisma.medicalRecord.update({
    where: { id: recordId },
    data: { notes },
  });

  return NextResponse.json({ record: updated });
}
