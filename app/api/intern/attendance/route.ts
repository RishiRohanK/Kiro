import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const internId = searchParams.get("internId");
    
    if (!internId) {
      return NextResponse.json({ error: "Identity token required" }, { status: 400 });
    }

    const [attendances, totalTrackingDays] = await Promise.all([
      prisma.attendance.findMany({
        where: { userId: internId },
        orderBy: { date: "desc" },
        take: 30,
      }),
      prisma.attendance.groupBy({
        by: ['date']
      }).then(res => res.length)
    ]);

    return NextResponse.json({ history: attendances, totalTrackingDays });
  } catch (error) {
    console.error("Attendance Retrieval error:", error);
    return NextResponse.json({ error: "Failed to fetch attendance logs" }, { status: 500 });
  }
}
