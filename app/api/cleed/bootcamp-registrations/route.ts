import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const registrations = await prisma.bootcampRegistration.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(registrations);
    } catch (error) {
        console.error("Fetch registrations error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
