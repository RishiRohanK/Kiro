import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (id) {
            // First try RichExam
            const richExam = await prisma.richExam.findUnique({
                where: { id },
                include: { questions: true }
            });
            if (richExam) {
                return NextResponse.json({ success: true, exam: richExam });
            }

            // If not found, try ScheduledExam
            const scheduledExam = await prisma.scheduledExam.findUnique({
                where: { id }
            });
            if (scheduledExam) {
                return NextResponse.json({ success: true, exam: scheduledExam });
            }

            return NextResponse.json({ success: false, error: "Exam not found" }, { status: 404 });
        }

        // Default to latest published RichExam if no ID
        const latestExam = await prisma.richExam.findFirst({
            where: { status: "PUBLISHED" },
            orderBy: { createdAt: "desc" },
            include: { questions: true }
        });

        if (latestExam) {
            return NextResponse.json({ success: true, exam: latestExam });
        }

        return NextResponse.json({ success: false, error: "No active exams found" }, { status: 404 });
    } catch (error) {
        console.error("Fetch Exam Details Error:", error);
        return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
    }
}
