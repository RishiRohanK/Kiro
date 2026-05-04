import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { resumeData: true }
        });

        return NextResponse.json({ success: true, resumeData: user?.resumeData || null });
    } catch (err) {
        console.error("Resume Fetch Error:", err);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { userId, resumeData } = await req.json();

        if (!userId || !resumeData) {
            return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: { resumeData }
        });

        return NextResponse.json({ success: true, message: "Resume saved successfully" });
    } catch (err) {
        console.error("Resume Save Error:", err);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
