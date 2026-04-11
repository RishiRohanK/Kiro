import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const sessions = await prisma.examSession.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            id: true
          }
        }
      },
      orderBy: { startedAt: 'desc' }
    });
    return NextResponse.json(sessions);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch exam sessions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    const session = await prisma.examSession.upsert({
      where: { userId },
      update: { 
        status: "STARTED",
        startedAt: new Date(),
        score: null,
        violations: 0
      },
      create: { 
        userId,
        status: "STARTED",
        startedAt: new Date()
      },
    });

    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json({ error: "Failed to start exam session" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId, status, score, violations } = await req.json();

    const session = await prisma.examSession.update({
      where: { userId },
      data: { 
        status, 
        score, 
        violations,
        updatedAt: new Date()
      },
    });

    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update exam session" }, { status: 500 });
  }
}
