import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date"); 
    
    if (!dateStr) {
      return NextResponse.json({ error: "Temporal coordinate required" }, { status: 400 });
    }

    const targetDate = new Date(dateStr);
    targetDate.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(targetDate);
    nextDay.setDate(targetDate.getDate() + 1);

    const attendances = await prisma.attendance.findMany({
      where: {
        date: {
          gte: targetDate,
          lt: nextDay,
        },
      },
    });

    return NextResponse.json(attendances);
  } catch (error) {
    console.error("Attendance Retrieval Error:", error);
    return NextResponse.json({ error: "Failed to retrieve terminal logs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { internId, status, workSummary, date } = await req.json();

    if (!internId || !status) {
      return NextResponse.json({ error: "Protocol parameters missing" }, { status: 400 });
    }

    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.upsert({
      where: {
        userId_date: {
          userId: internId,
          date: targetDate,
        },
      },
      update: {
        status,
        workSummary,
      },
      create: {
        userId: internId,
        status,
        workSummary,
        date: targetDate,
      },
    });

    return NextResponse.json(attendance);
  } catch (error) {
    console.error("Attendance Marking Error:", error);
    return NextResponse.json({ error: "Failed to synchronize attendance state" }, { status: 500 });
  }
}
