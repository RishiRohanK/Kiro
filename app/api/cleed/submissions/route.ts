import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [feedback, uiux, weekly] = await Promise.all([
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
      })
    ]);

    return NextResponse.json({ feedback, uiux, weekly });
  } catch (error: any) {
    console.error("Fetch submissions error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
