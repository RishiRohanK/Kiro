import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const exams = await prisma.scheduledExam.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ success: true, exams });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}
