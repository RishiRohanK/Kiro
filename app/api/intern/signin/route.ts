import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ error: "No account found with this email." }, { status: 404 });
        }

        // 1. Check if account is currently locked
        if (user.lockUntil && new Date() < new Date(user.lockUntil)) {
            const remainingHours = Math.ceil((new Date(user.lockUntil).getTime() - new Date().getTime()) / (1000 * 60 * 60));
            return NextResponse.json({ 
                error: `Account is locked due to multiple failed attempts. Please try again after ${remainingHours} hours.` 
            }, { status: 403 });
        }

        // 2. Validate password
        const isValid = await bcrypt.compare(password, user.password);
        
        if (!isValid) {
            const newFailedAttempts = (user.failedAttempts || 0) + 1;
            const updateData: any = { failedAttempts: newFailedAttempts };
            
            // Lock for 28 hours if threshold reached (e.g., 5 attempts)
            if (newFailedAttempts >= 5) {
                updateData.lockUntil = new Date(Date.now() + 28 * 60 * 60 * 1000);
            }

            await prisma.user.update({
                where: { id: user.id },
                data: updateData
            });

            const remainingAttempts = Math.max(0, 5 - newFailedAttempts);
            const message = remainingAttempts > 0 
                ? `Invalid password. ${remainingAttempts} attempts remaining before a 28-hour lockout.`
                : "Invalid password. Account has been locked for 28 hours.";

            return NextResponse.json({ error: message }, { status: 401 });
        }

        // 3. Reset lockout on success
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { failedAttempts: 0, lockUntil: null }
        });
        
        const { password: _, ...userWithoutPassword } = updatedUser;

        return NextResponse.json({ 
            success: true, 
            user: userWithoutPassword 
        });
    } catch (error) {
        console.error("Intern sign-in error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
