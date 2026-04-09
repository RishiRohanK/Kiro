import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const internId = searchParams.get('internId');

    if (!internId) {
      return NextResponse.json({ error: "Intern ID is required" }, { status: 400 });
    }

    const reports = await prisma.scheduleSubmission.findMany({
      where: {
        internId,
        status: "REVIEWED"
      },
      include: {
        schedule: {
          select: {
            week: true,
            typeOfWork: true
          }
        }
      },
      orderBy: {
        reviewedAt: "desc"
      }
    });

    return NextResponse.json({ success: true, reports });
  } catch (error) {
    console.error("Fetch reports error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
