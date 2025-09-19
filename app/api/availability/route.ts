import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate, AuthenticatedUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authUser = await authenticate(req);

  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const doctorId = url.searchParams.get("doctorId");

  if (authUser.role === "DOCTOR") {
    const availabilities = await prisma.availability.findMany({
      where: { doctorId: authUser.id },
      orderBy: { day: "asc" },
    });
    return NextResponse.json({ availabilities });
  } else if (authUser.role === "PATIENT" && doctorId) {
    const availabilities = await prisma.availability.findMany({
      where: { doctorId },
      orderBy: { day: "asc" },
    });
    return NextResponse.json({ availabilities });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function POST(req: NextRequest) {
  const authUser = await authenticate(req);

  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (authUser.role !== "DOCTOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { day, startTime, endTime } = await req.json();

  if (!day || !startTime || !endTime) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const newSlot = await prisma.availability.create({
    data: { doctorId: authUser.id, day, startTime, endTime },
  });

  return NextResponse.json({ slot: newSlot });
}