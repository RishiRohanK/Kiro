import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const status = await prisma.examStatus.findUnique({
      where: { id: "global_exam_state" },
    });
    
    // If not exists, create it
    if (!status) {
      const newStatus = await prisma.examStatus.create({
        data: { id: "global_exam_state", isActive: false },
      });
      return NextResponse.json(newStatus);
    }

    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch exam status" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { isActive } = await req.json();

    const status = await prisma.examStatus.upsert({
      where: { id: "global_exam_state" },
      update: { 
        isActive,
        startedAt: isActive ? new Date() : null 
      },
      create: { 
        id: "global_exam_state", 
        isActive,
        startedAt: isActive ? new Date() : null
      },
    });

    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update exam status" }, { status: 500 });
  }
}
