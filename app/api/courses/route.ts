import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const course = await prisma.course.create({
            data: {
                ...body,
                
                outcomes: body.outcomes || [],
                skills: body.skills || [],
                targetAudience: body.targetAudience || [],
                requirements: body.requirements || [],
                
                rating: parseFloat(body.rating) || 0,
                ratingCount: parseInt(body.ratingCount) || 0,
                enrolledCount: parseInt(body.enrolledCount) || 0,
                projectsCount: parseInt(body.projectsCount) || 0,
                lecturesCount: parseInt(body.lecturesCount) || 0,
                downloadableResources: parseInt(body.downloadableResources) || 0,
            }
        });
        return NextResponse.json({ success: true, course });
    } catch (error: any) {
        console.error("Course Create Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const courses = await prisma.course.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ success: true, courses });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
