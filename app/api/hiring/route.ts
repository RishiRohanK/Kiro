import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { name, email, phone, position, resumeLink, college, portfolioLink, yearOfStudy } = await req.json();

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
                college,
                portfolioLink,
                yearOfStudy,
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

export async function PATCH(req: Request) {
    try {
        const { id, status } = await req.json();
        if (!id || !status) return NextResponse.json({ error: "ID and status required." }, { status: 400 });

        const updated = await prisma.hiringApplication.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json({ success: true, updated });
    } catch (error) {
        console.error("Hiring Status patch error:", error);
        return NextResponse.json({ error: "Failed to update node." }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "ID required." }, { status: 400 });

        await prisma.hiringApplication.delete({
            where: { id }
        });

        return NextResponse.json({ success: true, message: "Node neutralized." });
    } catch (error) {
        console.error("Hiring deletion error:", error);
        return NextResponse.json({ error: "Failed to neutralize node." }, { status: 500 });
    }
}
