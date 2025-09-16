import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticate } from "@/lib/auth";

// GET: Fetch prescriptions for the logged-in user
export async function GET(req: Request) {
  const authResult = authenticate(req as any);
  if (authResult instanceof NextResponse) return authResult;

  const { userId, role } = authResult;

  let prescriptions;
  if (role === "PATIENT") {
    prescriptions = await prisma.prescription.findMany({
      where: { patientId: userId },
      include: { doctor: true, patient: true, pharmacy: true, appointment: true },
      orderBy: { createdAt: "desc" },
    });
  } else if (role === "DOCTOR") {
    prescriptions = await prisma.prescription.findMany({
      where: { doctorId: userId },
      include: { doctor: true, patient: true, pharmacy: true, appointment: true },
      orderBy: { createdAt: "desc" },
    });
  } else if (role === "PHARMACY") {
    prescriptions = await prisma.prescription.findMany({
      where: { pharmacyId: userId },
      include: { doctor: true, patient: true, pharmacy: true, appointment: true },
      orderBy: { createdAt: "desc" },
    });
  } else {
    // Admin
    prescriptions = await prisma.prescription.findMany({
      include: { doctor: true, patient: true, pharmacy: true, appointment: true },
      orderBy: { createdAt: "desc" },
    });
  }

  return NextResponse.json({ prescriptions });
}

// POST: Create a new prescription (Doctor only)
export async function POST(req: Request) {
  const authResult = authenticate(req as any);
  if (authResult instanceof NextResponse) return authResult;

  const { userId, role } = authResult;
  const body = await req.json();
  const { patientId, appointmentId, medication, pharmacyId } = body;

  if (role !== "DOCTOR") {
    return NextResponse.json({ error: "Only doctors can create prescriptions" }, { status: 403 });
  }

  const prescription = await prisma.prescription.create({
    data: {
      doctorId: userId,
      patientId,
      appointmentId,
      medication,
      pharmacyId,
    },
  });

  return NextResponse.json({ prescription }, { status: 201 });
}
