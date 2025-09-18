// app/api/appointments/doctor/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ await params

  if (!id) {
    return NextResponse.json({ error: "Doctor ID required" }, { status: 400 });
  }

  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: id,
        date: {
          gte: new Date(), // only future ones
        },
      },
      include: {
        patient: { select: { id: true, name: true, email: true } },
      },
      orderBy: { date: "asc" },
    });

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error("Doctor appointments error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
