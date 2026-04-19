import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const intern = await prisma.user.findUnique({
      where: { id },
      include: {
        tasks: {
          orderBy: { createdAt: 'desc' }
        },
        scheduleSubmissions: {
          include: {
            schedule: true
          },
          orderBy: { createdAt: 'desc' }
        },
        attendances: {
          orderBy: { date: 'desc' }
        },
        examSessions: {
          orderBy: { startedAt: 'desc' }
        }
      }
    });

    if (!intern) {
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });
    }

    // Also fetch other potential submissions
    const taskSubmissions = await prisma.taskSubmission.findMany({
      where: { email: intern.email },
      orderBy: { createdAt: 'desc' }
    });

    const uiuxSubmissions = await prisma.uIUXSubmission.findMany({
      where: { userId: intern.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      intern,
      taskSubmissions,
      uiuxSubmissions
    });
  } catch (error) {
    console.error("Error fetching intern details:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
