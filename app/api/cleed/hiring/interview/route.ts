
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
            // Optionally update applicant status to 'called' or similar
            await prisma.hiringApplication.update({
                where: { id: applicantId },
                data: { status: "interview_scheduled" }
            });
            return NextResponse.json({ success: true, message: "Interview invitation dispatched successfully." });
        } else {
            return NextResponse.json({ error: "Failed to dispatch interview email." }, { status: 500 });
        }

    } catch (error) {
        console.error("Interview API Error:", error);
        return NextResponse.json({ error: "Critical synchronization failure." }, { status: 500 });
    }
}
