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

    const internAttendances = await prisma.attendance.findMany({
      where: { userId: internId },
      orderBy: { date: "desc" },
      take: 30,
    });

    // Start tracking from the day they were created (ignoring time for fair start)
    const internCreationDate = new Date(intern.createdAt);
    internCreationDate.setHours(0, 0, 0, 0);

    const relevantTrackingDays = allDates.filter(d => {
       const sessionDate = new Date(d.date);
       sessionDate.setHours(0, 0, 0, 0);
       return sessionDate >= internCreationDate;
    }).length;

    return NextResponse.json({ 
      history: internAttendances, 
      totalTrackingDays: relevantTrackingDays 
    });
  } catch (error) {
    console.error("Attendance Retrieval error:", error);
    return NextResponse.json({ error: "Failed to fetch attendance logs" }, { status: 500 });
  }
}
