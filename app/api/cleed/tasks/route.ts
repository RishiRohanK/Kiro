import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { internId, batch, title, description, attachmentUrl } = await req.json();

    if (!internId || !title || !description) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        batch: batch || "Batch 1",
        attachmentUrl: attachmentUrl || null,
        assignedRole: "INTERN",
        assignedToId: internId,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Failed to allocate task" }, { status: 500 });
  }
}


export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        user: true, 
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch task log" }, { status: 500 });
  }
}
