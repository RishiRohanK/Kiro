import { NextResponse } from "next/server";
import { sendCleedPasswordResetEmail } from "@/lib/mail";
import crypto from "crypto";
import { tokenStore } from "@/lib/cleed-tokens";

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
    const expires = Date.now() + 15 * 60 * 1000; // 15 mins

    tokenStore.set(token, { email, expires });

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


