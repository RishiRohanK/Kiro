import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get('teamId');
    const userId = searchParams.get('userId');
    const targetId = searchParams.get('targetId');

    if (!teamId) {
      return NextResponse.json({ error: "Mission Enclave ID required" }, { status: 400 });
    }

    let whereClause: any = { teamId };

    if (userId && targetId) {
      // Fetch DMs between two specific users in this team
      whereClause = {
        teamId,
        OR: [
          { senderId: userId, targetId: targetId },
          { senderId: targetId, targetId: userId }
        ]
      };
    } else {
      // Fetch group messages (where targetId is null)
      whereClause = {
        teamId,
        targetId: null
      };
    }

    const messages = await prisma.message.findMany({
      where: whereClause,
      orderBy: { createdAt: "asc" },
      take: 100 
    });

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("Communication logs retrieval failure:", error);
    return NextResponse.json({ error: "Failed to retrieve logs" }, { status: 500 });
  }
}
