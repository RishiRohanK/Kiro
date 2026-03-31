import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Public: Retrieve Authorized Internships
export async function GET() {
    try {
        const internships = await prisma.internship.findMany({
            where: { isApproved: true },
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json({ success: true, internships });
    } catch (err) {
        return NextResponse.json({ success: false, error: "Synch protocol failure." }, { status: 500 });
    }
}
