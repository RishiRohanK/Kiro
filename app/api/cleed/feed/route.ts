import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const posts = await prisma.feedPost.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ success: true, posts });
    } catch (error) {
        console.error("Fetch feed posts error:", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, content, type, fileUrl, fileName, category, authorName, batch } = body;
        
        if (!title || !type) {
            return NextResponse.json({ success: false, error: "Title and type are required fields." }, { status: 400 });
        }

        const post = await prisma.feedPost.create({
            data: {
                title,
                content,
                type,
                fileUrl,
                fileName,
                category: category || "General",
                authorName: authorName || "Trainer",
                batch: batch || "All"
            }
        });
        return NextResponse.json({ success: true, post });
    } catch (error) {
        console.error("Create feed post error:", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) {
            return NextResponse.json({ success: false, error: "Missing post ID" }, { status: 400 });
        }
        await prisma.feedPost.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete feed post error:", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}
