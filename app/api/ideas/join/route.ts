import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function POST(req: Request) {
    try {
        const { ideaId, name, email } = await req.json();

        if (!ideaId || !name || !email) {
            return NextResponse.json({ success: false, error: "Missing required mission parameters (ideaId, name, email)." }, { status: 400 });
        }

        const join = await prisma.ideaJoin.create({
            data: {
                ideaId,
                name,
                email
            }
        });

        return NextResponse.json({ success: true, join });
    } catch (err) {
        console.error("Collaboration Protocol Failure:", err);
        return NextResponse.json({ success: false, error: "Critical synchronization error during Join Collective protocol." }, { status: 500 });
    }
}
