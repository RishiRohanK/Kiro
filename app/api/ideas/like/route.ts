import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Public: Increment Likes for an Idea
export async function PATCH(req: Request) {
    try {
        const { ideaId } = await req.json();

        if (!ideaId) {
            return NextResponse.json({ success: false, error: "Target node missing" }, { status: 400 });
        }

        const updatedIdea = await prisma.idea.update({
            where: { id: ideaId },
            data: {
                likes: {
                    increment: 1
                }
            }
        });

        return NextResponse.json({ success: true, likes: updatedIdea.likes });
    } catch (err) {
        console.error("Like Protocol Failure:", err);
        return NextResponse.json({ success: false, error: "Synchronization failure during Like protocol." }, { status: 500 });
    }
}
