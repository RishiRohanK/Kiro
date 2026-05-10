import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendBulkCustomEmail } from "@/lib/mail";

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

        // Send emails directly
        const sendPromises = registrations.map(reg => 
            sendBulkCustomEmail(reg.email, reg.name, subject, title, content)
        );

        await Promise.all(sendPromises);

        return NextResponse.json({ success: true, message: `Sent ${registrations.length} emails.` });
    } catch (error) {
        console.error("Bulk mail error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
