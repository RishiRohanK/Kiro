import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const intern = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                tasks: {
                    orderBy: { createdAt: 'desc' }
                },
                personalTasks: {
                    orderBy: { createdAt: 'desc' }
                },
                scheduleSubmissions: {
                    include: {
                        schedule: true
                    },
                    orderBy: { createdAt: 'desc' }
                },
                attendances: {
                    orderBy: { date: 'desc' }
                },
                examSessions: {
                    orderBy: { startedAt: 'desc' }
                }
            }
        });

        if (!intern) {
            return NextResponse.json({ error: "Intern not found" }, { status: 404 });
        }

        const taskSubmissions = await prisma.taskSubmission.findMany({
            where: { email: intern.email },
            orderBy: { createdAt: 'desc' }
        });

        const uiuxSubmissions = await prisma.uIUXSubmission.findMany({
            where: { userId: intern.id },
            orderBy: { createdAt: 'desc' }
        });

        const feedback = await prisma.feedback.findMany({
            where: { userId: intern.id },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({
            success: true,
            intern,
            taskSubmissions,
            uiuxSubmissions,
            feedback
        });
    } catch (error) {
        console.error("Profile fetch error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const { 
            userId, 
            name, 
            college, 
            year, 
            department, 
            dob, 
            graduationYear, 
            interestedArea,
            profileImage
        } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                college,
                year,
                department,
                dob,
                graduationYear,
                interestedArea,
                profileImage
            }
        });

        // Remove sensitive info
        const { password: _, ...userWithoutPassword } = updatedUser;

        return NextResponse.json({ 
            success: true, 
            user: userWithoutPassword 
        });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
