import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
    try {
        const { 
            userId, 
            name, 
            college, 
            year, 
            department, 
            dob, 
            graduationYear, 
            interestedArea,
            profileImage
        } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                college,
                year,
                department,
                dob,
                graduationYear,
                interestedArea,
                profileImage
            }
        });

        // Remove sensitive info
        const { password: _, ...userWithoutPassword } = updatedUser;

        return NextResponse.json({ 
            success: true, 
            user: userWithoutPassword 
        });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
