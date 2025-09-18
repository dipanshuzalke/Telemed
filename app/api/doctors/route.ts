import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all doctors
export async function GET() {
  try {
    const doctors = await prisma.user.findMany({
      where: { role: "DOCTOR" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(doctors, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 });
  }
}
