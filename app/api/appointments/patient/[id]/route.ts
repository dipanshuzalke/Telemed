// app/api/appointments/patient/[patientId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticate, AuthenticatedUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { patientId: string } }
) {
  const user = await authenticate(req);

    // If not authenticated
  if (user instanceof NextResponse) {
    return user;
  }

  const authUser = user as AuthenticatedUser;

  if (authUser.role !== "PATIENT" || authUser.id !== params.patientId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const appointments = await prisma.appointment.findMany({
      where: { patientId: params.patientId },
      include: { doctor: true },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}
