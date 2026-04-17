import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const resources = await prisma.internResource.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ success: true, resources });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, description, type, url, category, date, batch } = body;
        const resource = await prisma.internResource.create({
            data: { 
                title, 
                description, 
                type, 
                url, 
                category: category || "General", 
                date, 
                batch: batch || "All" 
            }
        });
        return NextResponse.json({ success: true, resource });
    } catch (error) {
        console.error("Resource creation error:", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ success: false, error: "Missing ID" }, { status: 400 });
        await prisma.internResource.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}
