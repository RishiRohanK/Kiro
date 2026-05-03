import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        const globalStatus = await prisma.examStatus.findUnique({
            where: { id: "global_exam_state" }
        });

        if (id) {
            // First try RichExam
            const richExam = await prisma.richExam.findUnique({
                where: { id },
                include: { questions: true }
            });
            if (richExam) {
                return NextResponse.json({ success: true, exam: richExam, isExamActive: globalStatus?.isActive || false });
            }

            // If not found, try ScheduledExam
            const scheduledExam = await prisma.scheduledExam.findUnique({
                where: { id }
            });
            if (scheduledExam) {
                return NextResponse.json({ success: true, exam: scheduledExam, isExamActive: globalStatus?.isActive || false });
            }

            return NextResponse.json({ success: false, error: "Exam not found", isExamActive: globalStatus?.isActive || false }, { status: 404 });
        }

        // Fetch global exam status
        const globalStatus = await prisma.examStatus.findUnique({
            where: { id: "global_exam_state" }
        });

        if (latestExam) {
            return NextResponse.json({ 
                success: true, 
                exam: latestExam,
                isExamActive: globalStatus?.isActive || false
            });
        }

        return NextResponse.json({ success: false, error: "No active exams found", isExamActive: globalStatus?.isActive || false }, { status: 404 });
    } catch (error) {
        console.error("Fetch Exam Details Error:", error);
        return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
    }
}
