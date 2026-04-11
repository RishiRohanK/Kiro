import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const status = await prisma.examStatus.findUnique({
      where: { id: "global_exam_state" },
    });
    
    // Also fetch security to give admin dashboard the exit key
    let security = await prisma.examSecurity.findUnique({
      where: { id: "global_exam_security" },
    });
    
    if (!status) {
      await prisma.examStatus.create({
        data: { id: "global_exam_state", isActive: false },
      });
    }

    if (!security) {
      security = await prisma.examSecurity.create({
        data: { id: "global_exam_security", exitKey: "000000" },
      });
    }

    return NextResponse.json({ 
        id: "global_exam_state",
        isActive: status ? status.isActive : false,
        exitKey: security.exitKey
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch admin exam status" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { isActive, exitKey } = await req.json();

    if (isActive !== undefined) {
        await prisma.examStatus.upsert({
          where: { id: "global_exam_state" },
          update: { isActive, startedAt: isActive ? new Date() : null },
          create: { id: "global_exam_state", isActive, startedAt: isActive ? new Date() : null },
        });
    }

    if (exitKey !== undefined) {
        await prisma.examSecurity.upsert({
          where: { id: "global_exam_security" },
          update: { exitKey },
          create: { id: "global_exam_security", exitKey },
        });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update exam status" }, { status: 500 });
  }
}
