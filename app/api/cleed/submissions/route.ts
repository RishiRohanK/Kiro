import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [feedback, uiux, weekly, publicTasks] = await Promise.all([
      prisma.feedback.findMany({ 
        orderBy: { createdAt: "desc" } 
      }),
      prisma.uIUXSubmission.findMany({ 
        orderBy: { createdAt: "desc" } 
      }),
      prisma.scheduleSubmission.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          intern: {
            select: { name: true, email: true }
          },
          schedule: {
            select: { week: true, projectName: true }
          }
        }
      }),
      prisma.taskSubmission.findMany({
        orderBy: { createdAt: "desc" }
      })
    ]);

    return NextResponse.json({ 
      success: true,
      feedback, 
      uiux, 
      weekly, 
      publicTasks,
      submissions: weekly // Alias for the internal dashboard's Audit tab
    });
  } catch (error: any) {
    console.error("Fetch submissions error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
