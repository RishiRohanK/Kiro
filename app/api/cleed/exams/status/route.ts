import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const status = await prisma.examStatus.findUnique({
      where: { id: "global_exam_state" },
    });
    
    if (!status) {
      const newStatus = await prisma.examStatus.create({
        data: { id: "global_exam_state", isActive: false, exitKey: "000000" },
      });
      return NextResponse.json(newStatus);
    }

    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch admin exam status" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { isActive, exitKey } = await req.json();

    const data: any = {};
    if (isActive !== undefined) {
        data.isActive = isActive;
        data.startedAt = isActive ? new Date() : null;
    }
    if (exitKey !== undefined) {
        data.exitKey = exitKey;
    }

    const status = await prisma.examStatus.upsert({
      where: { id: "global_exam_state" },
      update: data,
      create: { 
        id: "global_exam_state", 
        isActive: isActive ?? false,
        exitKey: exitKey ?? "000000",
        startedAt: isActive ? new Date() : null
      },
    });

    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update exam status" }, { status: 500 });
  }
}
