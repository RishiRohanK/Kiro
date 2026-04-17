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
