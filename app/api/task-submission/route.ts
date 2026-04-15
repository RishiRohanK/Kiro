import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, taskAllocated, githubLink, liveLink } = body;

    if (!name || !email || !taskAllocated || !githubLink || !liveLink) {
      return NextResponse.json(
        { error: "All fields are mandatory" },
        { status: 400 }
      );
    }

    const submission = await prisma.taskSubmission.create({
      data: {
        name,
        email,
        taskAllocated,
        githubLink,
        liveLink,
      },
    });

    return NextResponse.json({ success: true, submission });
  } catch (error: any) {
    console.error("Task submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit task" },
      { status: 500 }
    );
  }
}
