import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { scheduleId, internId, githubLink, submissionLink } = body;

        // Server-side deadline enforcement
        const schedule = await prisma.schedule.findUnique({ where: { id: scheduleId } });
        if (!schedule) {
            return NextResponse.json({ success: false, error: "Schedule not found" }, { status: 404 });
        }
        if (new Date(schedule.deadline) < new Date()) {
            return NextResponse.json({ success: false, error: "Submission window is closed. The deadline has passed." }, { status: 403 });
        }

        const submission = await prisma.scheduleSubmission.upsert({
            where: {
                scheduleId_internId: {
                    scheduleId,
                    internId
                }
            },
            update: {
                githubLink,
                submissionLink
            },
            create: {
                scheduleId,
                internId,
                githubLink,
                submissionLink
            }
        });

        return NextResponse.json({ success: true, submission });
    } catch (error: any) {
        console.error("Submission error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
