import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const batch = searchParams.get("batch");

        let posts;
        if (batch && batch !== "All") {
            posts = await prisma.feedPost.findMany({
                where: {
                    OR: [
                        { batch: batch },
                        { batch: "All" }
                    ]
                },
                orderBy: { createdAt: 'desc' }
            });
        } else {
            posts = await prisma.feedPost.findMany({
                orderBy: { createdAt: 'desc' }
            });
        }

        return NextResponse.json({ success: true, posts });
    } catch (error) {
        console.error("Fetch intern feed posts error:", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}
