import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

export async function POST(req: Request) {
    
    return NextResponse.json({ error: "Registrations for Batch 2 are currently frozen. Please contact the Student Forge administration for information on next intake." }, { status: 403 });

    try {
        const { name, email, password, college } = await req.json();

        if (!name || !email || !password || !college) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: "User already exists with this email." }, { status: 400 });
        }

        
        const hashedPassword = await bcrypt.hash(password, 10);

        
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: Role.INTERN,
                isApproved: false, 
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
