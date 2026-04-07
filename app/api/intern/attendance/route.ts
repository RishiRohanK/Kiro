import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const internId = searchParams.get("internId");
    
    if (!internId) {
      return NextResponse.json({ error: "Identity token required" }, { status: 400 });
    }

    const [intern, allDates] = await Promise.all([
      prisma.user.findUnique({
        where: { id: internId },
        select: { createdAt: true }
      }),
      prisma.attendance.groupBy({
        by: ['date']
      })
    ]);

    if (!intern) {
       return NextResponse.json({ error: "Intern not found" }, { status: 404 });
    }

    const allInternAttendances = await prisma.attendance.findMany({
      where: { userId: internId },
    });

    const presentCount = new Set(allInternAttendances
      .filter(a => a.status === 'PRESENT' || a.status === 'LATE')
      .map(a => new Date(a.date).toDateString())
    ).size;

    const internCreationDate = new Date(intern.createdAt);
    internCreationDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(today.getTime() - internCreationDate.getTime());
    const relevantTrackingDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return NextResponse.json({ 
       history: allInternAttendances.slice(0, 30), 
       totalTrackingDays: relevantTrackingDays,
       presentCount: presentCount 
    });
  } catch (error) {
    console.error("Attendance Retrieval error:", error);
    return NextResponse.json({ error: "Failed to fetch attendance logs" }, { status: 500 });
  }
}
