import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get('teamId');

    if (!teamId) {
      return NextResponse.json({ error: "Mission Enclave ID required" }, { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: { teamId },
      orderBy: { createdAt: "asc" },
      take: 100 // Optimization to prevent mission-critical overhead
    });

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("Communication logs retrieval failure:", error);
    return NextResponse.json({ error: "Failed to retrieve logs" }, { status: 500 });
  }
}
