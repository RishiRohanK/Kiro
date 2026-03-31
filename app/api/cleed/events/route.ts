import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const events = await prisma.event.findMany({
            orderBy: { date: 'asc' }
        });
        return NextResponse.json({ success: true, events });
    } catch (error) {
        console.error("Failed to fetch events:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch events" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, description, category, date, location, price, image } = body;

        if (!title || !date || !location) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        const event = await prisma.event.create({
            data: {
                title,
                description: description || "",
                category: category || "General",
                date: new Date(date),
                location,
                price: price || "Free",
                image: image || "",
            }
        });

        return NextResponse.json({ success: true, event });
    } catch (error) {
        console.error("Failed to create event:", error);
        return NextResponse.json({ success: false, error: "Failed to create event" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const eventId = searchParams.get("id");

        if (!eventId) {
            return NextResponse.json({ success: false, error: "Missing event ID" }, { status: 400 });
        }

        await prisma.event.delete({
            where: { id: eventId }
        });

        return NextResponse.json({ success: true, message: "Event deleted" });
    } catch (error) {
        console.error("Failed to delete event:", error);
        return NextResponse.json({ success: false, error: "Failed to delete event" }, { status: 500 });
    }
}
