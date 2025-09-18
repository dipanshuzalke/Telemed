import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { day, startTime, endTime } = await req.json();

    const updated = await prisma.availability.update({
      where: { id: params.id },
      data: { day, startTime, endTime },
    });

    return NextResponse.json({ message: "Availability updated", updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.availability.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Availability deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
