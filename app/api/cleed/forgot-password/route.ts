import { NextResponse } from "next/server";
import { sendCleedPasswordResetEmail } from "@/lib/mail";
import crypto from "crypto";

// In-memory token store for demonstration (in production, use Redis or Database)
const resetTokens = new Map<string, { email: string, expires: number }>();

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const registeredEmail = process.env.CLEED_EMAIL;

    if (email !== registeredEmail) {
      // Security: Don't reveal if email exists, but here the user specifically asked to fix it
      return NextResponse.json({ error: "Unauthorized recovery request" }, { status: 403 });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = Date.now() + 15 * 60 * 1000; // 15 mins

    resetTokens.set(token, { email, expires });

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

// Export for usage in reset-password route
export { resetTokens };
