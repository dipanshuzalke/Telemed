import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // move to .env later

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await hash(password, 10);

    const patient = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: "PATIENT" },
    });

    // generate token
    const token = jwt.sign(
      { id: patient.id, email: patient.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      message: "Registration successful",
      token,
      patient: { id: patient.id, name: patient.name, email: patient.email },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
