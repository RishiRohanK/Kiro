import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function cuid(): string {
    return "c" + Math.random().toString(36).slice(2, 12) + Date.now().toString(36);
}

// GET all personal tasks for an intern
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    try {
        const tasks = await prisma.$queryRaw`
            SELECT * FROM "PersonalTask"
            WHERE "userId" = ${userId}
            ORDER BY "createdAt" DESC
        `;
        return NextResponse.json({ success: true, tasks });
    } catch (error) {
        console.error("GET personal tasks error:", error);
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

        const id = cuid();
        const taskStatus = status || "TODO";
        const now = new Date();

        await prisma.$executeRaw`
            INSERT INTO "PersonalTask" ("id", "userId", "title", "description", "status", "createdAt", "updatedAt")
            VALUES (${id}, ${userId}, ${title}, ${description ?? null}, ${taskStatus}, ${now}, ${now})
        `;

        const task = { id, userId, title, description: description ?? null, status: taskStatus, createdAt: now.toISOString(), updatedAt: now.toISOString() };
        return NextResponse.json({ success: true, task });
    } catch (error) {
        console.error("POST personal task error:", error);
        return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
    }
}

// PATCH update task status
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { taskId, status, title, description } = body;

        if (!taskId) {
            return NextResponse.json({ error: "Task ID required" }, { status: 400 });
        }

        const now = new Date();

        if (status !== undefined) {
            await prisma.$executeRaw`
                UPDATE "PersonalTask" SET "status" = ${status}, "updatedAt" = ${now} WHERE "id" = ${taskId}
            `;
        }
        if (title !== undefined) {
            await prisma.$executeRaw`
                UPDATE "PersonalTask" SET "title" = ${title}, "updatedAt" = ${now} WHERE "id" = ${taskId}
            `;
        }
        if (description !== undefined) {
            await prisma.$executeRaw`
                UPDATE "PersonalTask" SET "description" = ${description}, "updatedAt" = ${now} WHERE "id" = ${taskId}
            `;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("PATCH personal task error:", error);
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
        await prisma.$executeRaw`DELETE FROM "PersonalTask" WHERE "id" = ${taskId}`;
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE personal task error:", error);
        return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
    }
}
