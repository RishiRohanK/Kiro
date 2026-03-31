import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Dashboard: Fetch All Idea Pitches (Pending & Approved)
export async function GET() {
    try {
        const ideas = await prisma.idea.findMany({
            include: {
                joins: {
                    orderBy: {
                        createdAt: "desc"
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ success: true, ideas });
    } catch (error) {
        console.error("Dashboard idea sync failure");
        return NextResponse.json({ success: false, error: "System failure during ideation sync" }, { status: 500 });
    }
}

// Dashboard: Authorization Protocol (Approve/Delete)
export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id, isApproved } = body;

        if (!id) return NextResponse.json({ success: false, error: "Target node missing" }, { status: 400 });

        const updatedIdea = await prisma.idea.update({
            where: { id },
            data: { isApproved: isApproved ?? true }
        });

        return NextResponse.json({ success: true, idea: updatedIdea });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Authorization protocol failure" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const ideaId = searchParams.get("id");

        if (!ideaId) return NextResponse.json({ success: false, error: "Target node missing" }, { status: 400 });

        await prisma.idea.delete({
            where: { id: ideaId }
        });

        return NextResponse.json({ success: true, message: "Asset neutralized" });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Asset neutralization failure" }, { status: 500 });
    }
}
