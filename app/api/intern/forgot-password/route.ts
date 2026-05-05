import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { emailQueue } from "@/queues/emailQueue";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        
        
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            
            
            return NextResponse.json({ error: "No account found with this email." }, { status: 404 });
        }

        
        const token = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 3600000); 

        
        await prisma.resetToken.deleteMany({
            where: { email },
        });

        
        await prisma.resetToken.create({
            data: {
                token,
                email,
                expires,
            },
        });

        
        await emailQueue.add("password-reset", {
            type: "password-reset",
            data: { email, token },
        }, {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 5000,
            },
        });

        return NextResponse.json({ success: true, message: "Reset link sent if account exists." });
    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
