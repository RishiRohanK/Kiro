import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all personal tasks for an intern
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    try {
        const tasks = await prisma.personalTask.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json({ success: true, tasks });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
    }
}

// POST create a new personal task
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, title, description, status } = body;

        if (!userId || !title) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const task = await prisma.personalTask.create({
            data: {
                userId,
                title,
                description,
                status: status || "TODO"
            }
        });

        return NextResponse.json({ success: true, task });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
    }
}

// PATCH update task status or content
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { taskId, status, title, description } = body;

        if (!taskId) {
            return NextResponse.json({ error: "Task ID required" }, { status: 400 });
        }

        const task = await prisma.personalTask.update({
            where: { id: taskId },
            data: {
                status,
                title,
                description
            }
        });

        return NextResponse.json({ success: true, task });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
    }
}

// DELETE a personal task
export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("taskId");

    if (!taskId) {
        return NextResponse.json({ error: "Task ID required" }, { status: 400 });
    }

    try {
        await prisma.personalTask.delete({
            where: { id: taskId }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
    }
}
