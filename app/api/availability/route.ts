// app/api/availability/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate, AuthenticatedUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await authenticate(req);
  if ("error" in user) return user;

  const authUser = user as AuthenticatedUser;

  const url = new URL(req.url);
  const doctorId = url.searchParams.get("doctorId");

  // ✅ Patients can fetch, Doctors can fetch their own
  if (authUser.role === "DOCTOR") {
    // Doctors only see their own availability
    const availabilities = await prisma.availability.findMany({
      where: { doctorId: authUser.id },
      orderBy: { day: "asc" },
    });
    return NextResponse.json({ availabilities });
  } else if (authUser.role === "PATIENT" && doctorId) {
    // Patients can query any doctor’s availability
    const availabilities = await prisma.availability.findMany({
      where: { doctorId },
      orderBy: { day: "asc" },
    });
    return NextResponse.json({ availabilities });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function POST(req: NextRequest) {
  const user = await authenticate(req);

  if ("error" in user) return user;

  const authUser = user as AuthenticatedUser;

  if (authUser.role !== "DOCTOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { day, startTime, endTime } = await req.json();

  const newSlot = await prisma.availability.create({
    data: { doctorId: authUser.id, day, startTime, endTime },
  });

  return NextResponse.json({ slot: newSlot });
}
