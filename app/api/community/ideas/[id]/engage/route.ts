import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: ideaId } = await params;
    const { type } = await req.json(); 

    if (type === "like") {
      const idea = await prisma.idea.update({
        where: { id: ideaId },
        data: { likes: { increment: 1 } },
      });
      return NextResponse.json(idea);
    } else if (type === "share") {
       const idea = await prisma.idea.update({
        where: { id: ideaId },
        data: { shares: { increment: 1 } },
      });
      return NextResponse.json(idea);
    }

    return NextResponse.json({ error: "Invalid engagement type" }, { status: 400 });
  } catch (error) {
    console.error("Engagement error:", error);
    return NextResponse.json({ error: "Failed to update engagement" }, { status: 500 });
  }
}
