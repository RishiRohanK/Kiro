import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const batch = searchParams.get('batch');

    if (!batch) {
      return NextResponse.json({ error: "Batch is required" }, { status: 400 });
    }

    const submissions = await prisma.scheduleSubmission.findMany({
      where: {
        intern: {
          batch: batch === "All" ? undefined : batch
        }
      },
      include: {
        intern: {
          select: {
            name: true,
            email: true,
            employeeId: true
          }
        },
        schedule: {
          select: {
            week: true,
            typeOfWork: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json({ success: true, submissions });
  } catch (error) {
    console.error("Fetch submissions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, marks, review, reviewedBy } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Submission ID is required" }, { status: 400 });
    }

    const updated = await prisma.scheduleSubmission.update({
      where: { id },
      data: {
        marks,
        review,
        reviewedBy,
        reviewedAt: new Date(),
        status: "REVIEWED"
      }
    });

    return NextResponse.json({ success: true, submission: updated });
  } catch (error) {
    console.error("Grading error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
