import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            orderBy: {
                submissionDate: "desc",
            },
        });
        return NextResponse.json({ success: true, projects });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: "Failed to fetch projects" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { teamName, teamLeader, teamMembers, githubRepo } = body;

        if (!teamName || !teamLeader || !githubRepo || !teamMembers || teamMembers.length === 0) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        const project = await prisma.project.create({
            data: {
                teamName,
                teamLeader,
                teamMembers,
                githubRepo,
                status: "live", 
            },
        });

        return NextResponse.json({ success: true, project });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: "Failed to submit project" }, { status: 500 });
    }
}
