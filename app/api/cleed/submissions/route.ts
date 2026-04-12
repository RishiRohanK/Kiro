import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [feedback, uiux] = await Promise.all([
      prisma.feedback.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.uIUXSubmission.findMany({ orderBy: { createdAt: "desc" } })
    ]);

    return NextResponse.json({ feedback, uiux });
  } catch (error: any) {
    console.error("Fetch submissions error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
