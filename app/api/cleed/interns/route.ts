import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const interns = await prisma.user.findMany({
      where: {
        role: "INTERN",
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(interns);
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
