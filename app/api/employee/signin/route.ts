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

        // Ensure user is an employee (not an INTERN)
        if (user.role === "INTERN") {
             return NextResponse.json({ error: "This portal is for employees only." }, { status: 403 });
        }

        const isValid = await bcrypt.compare(password, user.password);
        
        if (!isValid) {
            return NextResponse.json({ error: "Invalid password." }, { status: 401 });
        }

        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({ 
            success: true, 
            user: userWithoutPassword 
        });
    } catch (error) {
        console.error("Employee sign-in error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
