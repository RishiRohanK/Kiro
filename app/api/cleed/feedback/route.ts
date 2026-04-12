import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const feedback = await prisma.feedback.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(feedback);
  } catch (error: any) {
    console.error("Failed to fetch feedback:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
