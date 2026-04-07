import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, description, stack, usp, outcomes, developer, name, subline } = body;

        if (!title || !description || !name) {
            return NextResponse.json({ success: false, error: "Mission critical fields missing" }, { status: 400 });
        }

        const pitch = await prisma.idea.create({
            data: {
                title,
                description,
                stack: stack || "",
                usp: usp || "",
                outcomes: outcomes || "",
                developer: developer || name,
                name,
                subline: subline || "New Idea Pitch",
                isApproved: false 
            }
        });

        return NextResponse.json({ success: true, pitch });
    } catch (error) {
        console.error("Pitch submission failure:", error);
        return NextResponse.json({ success: false, error: "Subsystem error during pitch submission" }, { status: 500 });
    }
}


export async function GET() {
    try {
        const pitches = await prisma.idea.findMany({
            where: { isApproved: true },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ success: true, pitches });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Data synchronization failure" }, { status: 500 });
    }
}
