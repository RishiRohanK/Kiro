import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { emailQueue } from "@/queues/emailQueue";

export async function POST(req: Request) {
    try {
        const { subject, title, content, targetIds } = await req.json();

        if (!subject || !title || !content || !targetIds || !targetIds.length) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const registrations = await prisma.bootcampRegistration.findMany({
            where: {
                id: { in: targetIds }
            }
        });

        // Add each email to the queue
        const jobs = registrations.map(reg => {
            return emailQueue.add("bulk-custom", {
                type: "bulk-custom",
                data: {
                    email: reg.email,
                    name: reg.name,
                    subject: subject,
                    title: title,
                    content: content
                }
            }, {
                attempts: 3,
                backoff: {
                    type: "exponential",
                    delay: 5000,
                },
            });
        });

        await Promise.all(jobs);

        return NextResponse.json({ success: true, message: `Queued ${registrations.length} emails.` });
    } catch (error) {
        console.error("Bulk mail error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
