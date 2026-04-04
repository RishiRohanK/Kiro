import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { name, email, phone, position, resumeLink } = await req.json();

        if (!name || !email || !phone || !position || !resumeLink) {
            return NextResponse.json({ error: "Mission critical parameters missing." }, { status: 400 });
        }

        const applicant = await prisma.hiringApplication.create({
            data: {
                name,
                email,
                phone,
                position,
                resumeLink,
                status: "pending"
            }
        });

        return NextResponse.json({ success: true, applicant });
    } catch (error: any) {
        console.error("Hiring Intake Error:", error);
        return NextResponse.json({ error: "Internal node synchronization failure." }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const applicants = await prisma.hiringApplication.findMany({
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json({ success: true, applicants });
    } catch (error) {
        return NextResponse.json({ error: "Failed to retrieve applicants." }, { status: 500 });
    }
}
