import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, syllabus, date, time, duration, guidelines, questions } = body;

        const exam = await prisma.richExam.create({
            data: {
                title,
                syllabus,
                date,
                time,
                duration,
                guidelines,
                status: "PUBLISHED", // Auto-publish for now as requested "after publish it must be live"
                questions: {
                    create: questions.map((q: any) => ({
                        type: q.type,
                        question: q.question,
                        options: q.options,
                        correctAnswer: q.correctAnswer,
                        imageUrl: q.imageUrl,
                        points: q.points || 1
                    }))
                }
            },
            include: {
                questions: true
            }
        });

        return NextResponse.json({ success: true, exam });
    } catch (error) {
        console.error("Exam Creation Error:", error);
        return NextResponse.json({ success: false, error: "Critical failure during exam insertion node." }, { status: 500 });
    }
}

export async function GET() {
    try {
        const exams = await prisma.richExam.findMany({
            include: {
                questions: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        return NextResponse.json({ success: true, exams });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Fetch failure." }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

        await prisma.richExam.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Deletion failed." }, { status: 500 });
    }
}
