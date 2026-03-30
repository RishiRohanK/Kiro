import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

export async function POST(req: Request) {
    try {
        const { name, email, password, college } = await req.json();

        if (!name || !email || !password || !college) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: "User already exists with this email." }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: Role.INTERN,
                isApproved: false, // Manual approval required
                college,
                batch: "Batch 2"
            },
        });

        const { password: _, ...userWithoutPassword } = newUser;

        return NextResponse.json({ success: true, user: userWithoutPassword });
    } catch (error) {
        console.error("Intern sign-up error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
