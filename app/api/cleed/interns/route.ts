import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [interns, globalTotalDays] = await Promise.all([
      prisma.user.findMany({
        where: { role: "INTERN" },
        include: {
          attendances: {
            select: { status: true }
          }
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.attendance.groupBy({
        by: ['date']
      }).then(res => res.length)
    ]);

    const internsWithAttendance = interns.map(intern => {
      const presentCount = intern.attendances.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
      const percentage = globalTotalDays > 0 ? (presentCount / globalTotalDays) * 100 : 0;
      const { attendances, ...rest } = intern;
      return {
        ...rest,
        attendancePercentage: Math.round(percentage),
        presentCount,
        totalTrackingDays: globalTotalDays
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

    // Safely remove the user inside a comprehensive transaction layer
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
