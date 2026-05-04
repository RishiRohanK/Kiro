import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { internId, internshipId, resumeData } = await req.json();

        if (!internId || !internshipId) {
            return NextResponse.json({ success: false, error: "Missing ID fields" }, { status: 400 });
        }

        // Check if already applied
        const existing = await prisma.internshipApplication.findUnique({
            where: {
                internId_internshipId: {
                    internId,
                    internshipId
                }
            }
        });

        if (existing) {
            return NextResponse.json({ success: false, error: "You have already applied for this internship." }, { status: 400 });
        }

        const application = await prisma.internshipApplication.create({
            data: {
                internId,
                internshipId,
                resumeData,
                status: "PENDING"
            }
        });

        return NextResponse.json({ success: true, application });
    } catch (err) {
        console.error("Application Error:", err);
        return NextResponse.json({ success: false, error: "Failed to submit application. Ensure database is updated." }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const internId = searchParams.get("internId");

        if (!internId) {
            return NextResponse.json({ success: false, error: "Intern ID required" }, { status: 400 });
        }

        const applications = await prisma.internshipApplication.findMany({
            where: { internId },
            include: {
                internship: true
            },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json({ success: true, applications });
    } catch (err) {
        console.error("Fetch Applications Error:", err);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
