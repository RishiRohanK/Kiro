import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const internId = searchParams.get('internId');
        const batch = searchParams.get('batch') || "Batch 1"; 

        const where: any = { batch };
        if (internId) {
            where.OR = [
                { teamInternIds: { has: internId } },
                { teamInternIds: { isEmpty: true } }
            ];
        }

        const schedules = await prisma.schedule.findMany({
            where,
            include: {
                submissions: internId ? {
                    where: { internId }
                } : true
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        // Resolve intern names for teamInternIds
        const allInternIds = Array.from(new Set(schedules.flatMap((s: any) => s.teamInternIds || [])));
        const internNamesMap: Record<string, string> = {};
        
        if (allInternIds.length > 0) {
            const interns = await prisma.user.findMany({
                where: { id: { in: allInternIds } },
                select: { id: true, name: true }
            });
            interns.forEach(i => {
                internNamesMap[i.id] = i.name;
            });
        }

        const mappedSchedules = schedules.map((s: any) => ({
            ...s,
            isCompleted: s.submissions && s.submissions.length > 0,
            githubLink: s.submissions?.[0]?.githubLink || null,
            submissionLink: s.submissions?.[0]?.submissionLink || null,
            teamInternNames: (s.teamInternIds || []).map((id: string) => internNamesMap[id] || "Unknown Intern")
        }));

        return NextResponse.json({ success: true, schedules: mappedSchedules });
    } catch (error) {
        console.error("Schedule Fetch Error:", error);
        return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { 
            week, 
            typeOfWork, 
            toolsUsed, 
            deploymentTools, 
            requirements, 
            description, 
            outcomes, 
            deadline,
            batch = "Batch 1",
            teamAllocation,
            mentorName,
            projectName,
            projectDocLink,
            teamLead,
            teamInternIds = [] // Received from admin selection
        } = body;

        const schedule = await prisma.schedule.create({
            data: {
                batch,
                week,
                typeOfWork,
                toolsUsed, 
                deploymentTools: deploymentTools || [], 
                requirements: requirements || [], 
                description,
                outcomes, 
                deadline: new Date(deadline),
                teamAllocation,
                mentorName,
                projectName,
                projectDocLink,
                teamLead,
                teamInternIds
            } as any
        });

        // Notify Interns via Email
        if (teamInternIds.length > 0) {
            const interns = await prisma.user.findMany({
                where: { id: { in: teamInternIds } },
                select: { email: true, name: true }
            });

            const teamNames = interns.map(i => i.name);
            const { sendTeamAssignmentEmail } = await import("@/lib/mail");

            for (const intern of interns) {
                if (intern.email) {
                    await sendTeamAssignmentEmail(
                        intern.email,
                        intern.name,
                        projectName || typeOfWork,
                        mentorName || "Admin",
                        teamNames
                    );
                }
            }
        }

        return NextResponse.json({ success: true, schedule });
    } catch (error: any) {
        console.error("Schedule Creation Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id, ...data } = body;

        if (data.deadline) data.deadline = new Date(data.deadline);

        const schedule = await prisma.schedule.update({
            where: { id },
            data
        });

        return NextResponse.json({ success: true, schedule });
    } catch (error: any) {
        console.error("Schedule Update Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) throw new Error("ID required");

        await prisma.schedule.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
