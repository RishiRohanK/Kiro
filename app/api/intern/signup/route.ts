import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
/**
 * Security Patch 2026-04-20:
 * - Upgraded Bcrypt Hash Cost to 12 rounds (Defense against Brute Force)
 * - Automatic Salting (Defense against Rainbow Attacks)
 * - HSTS/CSP Protected via central Proxy
 */
import { Role } from "@prisma/client";

export async function POST(req: Request) {
    // REGISTRATION FREEZE - 2026-04-23
    return NextResponse.json(
        { error: "Registration is currently frozen. Please contact administration for more details." }, 
        { status: 403 }
    );
    
    try {
        const { name, email, password, college, phone } = await req.json();

        if (!name || !email || !password || !college) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: "User already exists with this email." }, { status: 400 });
        }

        // Hashed with Salt Rounds 12 (Security Patch 2026-04-20)
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user with Batch 3 classification
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: Role.INTERN,
                isApproved: false, 
                college,
                phoneNumber: phone,
                batch: "Batch 3"
            },
        });

        const { password: _, ...userWithoutPassword } = newUser;

        return NextResponse.json({ success: true, user: userWithoutPassword });
    } catch (error) {
        console.error("Intern sign-up error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
