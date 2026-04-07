import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const course = await prisma.course.findUnique({
            where: { id: id }
        });
        if (!course) return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 });
        return NextResponse.json({ success: true, course });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        
        
        const { id: _, createdAt, updatedAt, ...updateData } = body;

        const course = await prisma.course.update({
            where: { id: id },
            data: {
                ...updateData,
                
                outcomes: updateData.outcomes || [],
                skills: updateData.skills || [],
                targetAudience: updateData.targetAudience || [],
                requirements: updateData.requirements || [],
                
                rating: parseFloat(updateData.rating) || 0,
                ratingCount: parseInt(updateData.ratingCount) || 0,
                enrolledCount: parseInt(updateData.enrolledCount) || 0,
                projectsCount: parseInt(updateData.projectsCount) || 0,
                lecturesCount: parseInt(updateData.lecturesCount) || 0,
                downloadableResources: parseInt(updateData.downloadableResources) || 0,
            }
        });
        return NextResponse.json({ success: true, course });
    } catch (error: any) {
        console.error("Course Update Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.course.delete({
            where: { id: id }
        });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Course Delete Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
