import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function cuid(): string {
    return "c" + Math.random().toString(36).slice(2, 12) + Date.now().toString(36);
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const { data, error } = await supabase
        .from("PersonalTask")
        .select("*")
        .eq("userId", userId)
        .order("createdAt", { ascending: false });

    if (error) {
        console.error("GET personal tasks error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, tasks: data });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, title, description, status } = body;

        if (!userId || !title) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const now = new Date().toISOString();
        const task = {
            id: cuid(),
            userId,
            title,
            description: description || null,
            status: status || "TODO",
            createdAt: now,
            updatedAt: now,
        };

        const { data, error } = await supabase.from("PersonalTask").insert([task]).select().single();

        if (error) {
            console.error("POST personal task error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, task: data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { taskId, status, title, description } = body;

        if (!taskId) {
            return NextResponse.json({ error: "Task ID required" }, { status: 400 });
        }

        const updates: any = { updatedAt: new Date().toISOString() };
        if (status !== undefined) updates.status = status;
        if (title !== undefined) updates.title = title;
        if (description !== undefined) updates.description = description;

        const { error } = await supabase.from("PersonalTask").update(updates).eq("id", taskId);

        if (error) {
            console.error("PATCH personal task error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("taskId");

    if (!taskId) {
        return NextResponse.json({ error: "Task ID required" }, { status: 400 });
    }

    const { error } = await supabase.from("PersonalTask").delete().eq("id", taskId);

    if (error) {
        console.error("DELETE personal task error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
