import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { name, email, date, time, topic } = await req.json();

    if (!name || !email || !date || !time || !topic) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    const mentorship = await prisma.mentorship.create({
      data: { name, email, date, time, topic },
    });

    return NextResponse.json(mentorship, { status: 201 });
  } catch (err) {
    console.error("Mentorship creation error:", err);
    return NextResponse.json({ error: "Failed to schedule mentorship" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const sessions = await prisma.mentorship.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(sessions);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch mentorship sessions" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    const mentorship = await prisma.mentorship.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(mentorship);
  } catch (err) {
    console.error("Mentorship update error:", err);
    return NextResponse.json({ error: "Failed to update mentorship session" }, { status: 500 });
  }
}

