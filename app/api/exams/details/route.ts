import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (id) {
            const exam = await prisma.richExam.findUnique({
                where: { id },
                include: {
                    questions: true
                }
            });
            if (exam) {
                return NextResponse.json({ success: true, exam });
            }
            return NextResponse.json({ success: false, error: "Exam not found" }, { status: 404 });
        }

        // Get the latest published exam if no ID is provided
        const latestExam = await prisma.richExam.findFirst({
            where: { status: "PUBLISHED" },
            orderBy: { createdAt: "desc" },
            include: {
                questions: true
            }
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
