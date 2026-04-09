import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const batch = searchParams.get('batch');

    const where: any = { role: "INTERN" };
    if (batch && batch !== "All") {
      where.batch = batch;
    }

    const [interns, allDates] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          attendances: {
            select: { status: true, date: true }
          }
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.attendance.groupBy({
        by: ['date']
      })
    ]);

    const internsWithAttendance = interns.map(intern => {
      
      const presentCount = new Set(intern.attendances
        .filter(a => a.status === 'PRESENT' || a.status === 'LATE')
        .map(a => new Date(a.date).toDateString())
      ).size;
      
      const internCreationDate = new Date(intern.createdAt);
      internCreationDate.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      
      const diffTime = Math.abs(today.getTime() - internCreationDate.getTime());
      const relevantDaysCount = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

      const percentage = relevantDaysCount > 0 ? (presentCount / relevantDaysCount) * 100 : 0;
      const { attendances, ...rest } = intern;
      
      return {
        ...rest,
        attendancePercentage: Math.min(100, Math.round(percentage)),
        presentCount,
        totalTrackingDays: relevantDaysCount
      };
    });

    return NextResponse.json(internsWithAttendance);
  } catch (error) {
    console.error("Error fetching interns:", error);
    return NextResponse.json({ error: "Failed to fetch interns" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: "Intern ID is required parameter" }, { status: 400 });
    }

    
    await prisma.$transaction([
      prisma.attendance.deleteMany({ where: { userId: id } }),
      prisma.personalTask.deleteMany({ where: { userId: id } }),
      prisma.scheduleSubmission.deleteMany({ where: { internId: id } }),
      prisma.task.deleteMany({ where: { assignedToId: id } }),
      prisma.user.delete({ where: { id } })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error executing user termination:", error);
    return NextResponse.json({ error: "Termination protocol failed" }, { status: 500 });
  }
}
