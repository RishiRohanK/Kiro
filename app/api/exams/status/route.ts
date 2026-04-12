import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const status = await prisma.examStatus.findUnique({
      where: { id: "global_exam_state" },
    });
    
    if (!status) {
      const newStatus = await prisma.examStatus.create({
        data: { id: "global_exam_state", isActive: false },
      });
      return NextResponse.json({ isActive: newStatus.isActive });
    }

    return NextResponse.json({ isActive: status.isActive });
  } catch (error) {
    console.error("GET ExamStatus Error:", error);
    return NextResponse.json({ error: "Failed to fetch exam status" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { isActive } = await req.json();

    const data: any = {};
    if (isActive !== undefined) {
        data.isActive = isActive;
        data.startedAt = isActive ? new Date() : null;
    }

    const status = await prisma.examStatus.upsert({
      where: { id: "global_exam_state" },
      update: data,
      create: { 
        id: "global_exam_state", 
        isActive: isActive ?? false,
        startedAt: isActive ? new Date() : null
      },
    });

    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update exam status" }, { status: 500 });
  }
}
