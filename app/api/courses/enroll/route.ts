import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    let body: any = {};
    try {
        body = await req.json();
        const {
            courseId,
            name,
            phone,
            email,
            college,
            branch,
            year,
            whyJoin,
            referenceId,
            transactionId,
            bankName,
            accountName,
            amount
        } = body;

        
        const enrollment = await prisma.courseEnrollment.create({
            data: {
                courseId,
                name,
                phone,
                email,
                college,
                branch,
                year,
                whyJoin,
                referenceId,
                transactionId,
                bankName,
                accountName,
                amount,
                status: "pending"
            }
        });

        return NextResponse.json({ success: true, enrollment });
    } catch (error: any) {
        console.error("Enrollment Error:", error);

        try {
            await prisma.failedTransaction.create({
                data: {
                    courseId: body?.courseId,
                    name: body.name,
                    email: body.email,
                    phone: body.phone,
                    amount: body.amount?.toString(),
                    paymentMethod: "MANUAL_UPI",
                    reason: `Enrollment Failed: ${error.message === "This Reference ID has already been used." ? "Duplicate reference ID" : error.message}`,
                    errorDetails: { referenceId: body.referenceId, stack: error.stack }
                }
            });
        } catch (logError) {
            console.error("Failed to log failed transaction:", logError);
        }

        if (error.code === 'P2002') {
            return NextResponse.json({ success: false, error: "This Reference ID has already been used." }, { status: 400 });
        }
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const enrollments = await prisma.courseEnrollment.findMany({
            include: { course: true },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ success: true, enrollments });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
