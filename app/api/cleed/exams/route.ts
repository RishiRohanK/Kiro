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

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, date, duration, batch } = body;
        const exam = await prisma.scheduledExam.create({
            data: { 
                title, 
                date, 
                duration: String(duration), 
                batch: batch || "All" 
            }
        });
        return NextResponse.json({ success: true, exam });
    } catch (error) {
        console.error("Exam creation error:", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ success: false, error: "Missing ID" }, { status: 400 });
        await prisma.scheduledExam.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}
