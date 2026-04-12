import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, userName, taskName, taskLink, githubLink } = await req.json();

    if (!userId || !taskName || !taskLink) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const submission = await prisma.uIUXSubmission.create({
      data: { userId, userName, taskName, taskLink, githubLink: githubLink || null }
    });

    return NextResponse.json({ success: true, submission });
  } catch (error: any) {
    console.error("UI/UX submission error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const submissions = await prisma.uIUXSubmission.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(submissions);
  } catch (error: any) {
    console.error("UI/UX fetch error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
