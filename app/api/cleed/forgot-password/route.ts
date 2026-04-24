import { NextResponse } from "next/server";
import { sendCleedPasswordResetEmail } from "@/lib/mail";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const normalizedEmail = email?.trim().toLowerCase();
    const registeredEmail = process.env.CLEED_EMAIL?.trim().toLowerCase();

    if (normalizedEmail !== registeredEmail) {
      // Security: Don't reveal if email exists
      return NextResponse.json({ error: "Unauthorized recovery request" }, { status: 403 });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    // Persist token in database for stateless recovery (Vercel/Production)
    await prisma.resetToken.create({
      data: {
        token,
        email: normalizedEmail,
        expires
      }
    });

    const success = await sendCleedPasswordResetEmail(email, token);

    if (success) {
      return NextResponse.json({ success: true, message: "Recovery sequence initiated. Check your terminal." });
    } else {
      return NextResponse.json({ error: "Primary mail server failure" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal system error" }, { status: 500 });
  }
}


