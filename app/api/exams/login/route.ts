import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Use lower case email for matching
    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findFirst({
      where: { 
        email: {
          equals: normalizedEmail,
          mode: 'insensitive' // case-insensitive search
        }
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    let isPasswordValid = false;
    
    try {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } catch (err) {
      // If bcrypt fails, it might be due to plain text or invalid hash
      isPasswordValid = false;
    }

    // Fallback to plain text check for development sessions
    if (!isPasswordValid && password === user.password) {
      isPasswordValid = true;
    }

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
          id: user.id,
          name: user.name,
          email: user.email,
          batch: user.batch
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed on server" }, { status: 500 });
  }
}
