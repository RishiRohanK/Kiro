
import { sendInterviewEmail } from "@/lib/mail";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { applicantId, timing } = await req.json();

        if (!applicantId || !timing) {
            return NextResponse.json({ error: "Applicant identity and timing required." }, { status: 400 });
        }

        const applicant = await prisma.hiringApplication.findUnique({
            where: { id: applicantId }
        });

        if (!applicant) {
            return NextResponse.json({ error: "Applicant not found." }, { status: 404 });
        }

        const mailSent = await sendInterviewEmail(applicant.email, applicant.name, applicant.position, timing);

        if (mailSent) {
            // Update applicant status and timing for persistence
            await prisma.hiringApplication.update({
                where: { id: applicantId },
                data: { 
                    status: "interview_scheduled",
                    interviewTiming: timing
                }
            });
            return NextResponse.json({ success: true, message: "Interview invitation dispatched successfully." });
        } else {
            console.error("sendInterviewEmail returned false for", applicant.email);
            return NextResponse.json({ error: "Failed to dispatch email. Gmail sync may be blocked or invalid credentials." }, { status: 500 });
        }

    } catch (error) {
        console.error("Interview API Error:", error);
        return NextResponse.json({ error: "Critical synchronization failure." }, { status: 500 });
    }
}
